import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function POST(req) {
  try {
    const { patientIds } = await req.json();

    if (!patientIds || !Array.isArray(patientIds) || patientIds.length === 0) {
      return NextResponse.json({ message: 'Invalid patient IDs' }, { status: 400 });
    }

    if (!supabase) {
      // Mock return if DB is unavailable
      return NextResponse.json([
        { user_id: patientIds[0], dosha: 'Vata', severity: 'Moderate', score: 65, created_at: new Date().toISOString() }
      ], { status: 200 });
    }

    // Fetch the latest assessment for these patients
    // Since we only want the *latest* for each, we'll fetch all and group/sort in memory (or use a complex SQL query)
    // For simplicity in this Next.js API, we'll fetch them, order by created_at desc, and pick the first per user.
    const { data, error } = await supabase
      .from('assessments')
      .select('user_id, dosha, severity, score, created_at')
      .in('user_id', patientIds)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const latestAssessments = [];
    const seenUsers = new Set();
    
    for (const record of data) {
      if (!seenUsers.has(record.user_id)) {
        latestAssessments.push(record);
        seenUsers.add(record.user_id);
      }
    }

    return NextResponse.json(latestAssessments, { status: 200 });
  } catch (err) {
    console.error('Error fetching patient assessments:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
