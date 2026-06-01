import { NextResponse } from 'next/server';

// This acts as a proxy to the Python AI service
export async function POST(req) {
  try {
    const body = await req.json();
    const aiBase1 = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5003';
    const aiBase2 = process.env.AI_SERVICE_URL || 'http://127.0.0.1:5003';
    
    let response;
    let controller = new AbortController();
    let timeoutId = setTimeout(() => controller.abort(), 85000);
    
    try {
      console.log(`Trying ${aiBase1}...`);
      response = await fetch(`${aiBase1}/predict-direct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    } catch (e1) {
      clearTimeout(timeoutId);
      console.log(`${aiBase1} failed, trying ${aiBase2}...`);
      
      controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 85000);
      response = await fetch(`${aiBase2}/predict-direct`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
    }
    
    console.log(`Prediction response received: ${response?.status}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(errorData, { status: response.status });
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Fetch error:', err.message);
    return NextResponse.json({ message: `AI Service Error: ${err.message}` }, { status: 503 });
  }
}
