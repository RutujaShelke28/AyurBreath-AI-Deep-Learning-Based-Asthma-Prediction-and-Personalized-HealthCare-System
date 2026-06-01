import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET() {
  let dbStatus = 'disconnected';
  if (supabase) {
    try {
      const { error } = await supabase.from('users').select('id').limit(1);
      dbStatus = error ? 'error' : 'connected';
    } catch {
      dbStatus = 'error';
    }
  }

  return NextResponse.json({
    status: 'ok',
    service: 'asthma-nextjs',
    database: dbStatus,
    aiService: process.env.AI_SERVICE_URL || 'http://localhost:5002',
  });
}
