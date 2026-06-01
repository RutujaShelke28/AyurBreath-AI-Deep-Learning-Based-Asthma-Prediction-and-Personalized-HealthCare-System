import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/authMiddleware';
import { findAssessmentsByUserId } from '@/lib/models';

export async function GET(req) {
  const { user, error } = await authenticateRequest(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    const assessments = await findAssessmentsByUserId(user.id, 10);

    return NextResponse.json({
      totalAssessments: assessments.length,
      latestSeverity: assessments[0]?.severity || null,
      latestDosha: assessments[0]?.dosha || null,
      trend: assessments.map(a => ({
        date: a.created_at,
        severity: a.severity,
        score: a.score,
      })),
    });
  } catch {
    return NextResponse.json({
      totalAssessments: 0,
      latestSeverity: null,
      latestDosha: null,
      trend: [],
    });
  }
}
