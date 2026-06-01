import { NextResponse } from 'next/server';
import axios from 'axios';
import { authenticateRequest } from '@/lib/authMiddleware';
import { createAssessment, findAssessmentsByUserId } from '@/lib/models';


function fallbackAnalysis(answers) {
  const votes = { vata: 0, pitta: 0, kapha: 0 };
  Object.entries(answers).forEach(([k, v]) => {
    if (!k.startsWith('dq')) return;
    if (v.startsWith('A)')) votes.vata++;
    else if (v.startsWith('B)')) votes.pitta++;
    else if (v.startsWith('C)')) votes.kapha++;
  });
  
  let dosha = 'Vata';
  if (Object.keys(votes).length > 0) {
    dosha = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
  }

  return { dosha: dosha.charAt(0).toUpperCase() + dosha.slice(1), source: 'fallback' };
}

export async function POST(req) {
  const { user, error } = await authenticateRequest(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    const { answers } = await req.json();

    let aiResult;
    try {
      const aiBase = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5003';
      console.log(`Sending analyze request to: ${aiBase}/predict`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      
      const response = await fetch(`${aiBase}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      
      console.log(`Analyze response received: ${response.status}`);
      if (response.ok) {
        aiResult = await response.json();
      } else {
        throw new Error('AI Service returned an error status');
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
      aiResult = fallbackAnalysis(answers);
    }

    let assessmentId = null;
    try {
      const assessment = await createAssessment({
        userId: user.id,
        answers,
        dosha: aiResult.dosha,
        aiPrediction: aiResult,
      });
      assessmentId = assessment.id;
    } catch {
      // DB unavailable
    }

    return NextResponse.json({ ...aiResult, assessmentId });
  } catch (err) {
    return NextResponse.json({ message: 'Analysis failed' }, { status: 500 });
  }
}
