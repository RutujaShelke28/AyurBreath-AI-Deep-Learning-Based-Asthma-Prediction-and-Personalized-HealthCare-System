import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(req) {
  try {
    if (!supabase) {
      // Return a mock list of patients if no DB is available
      return NextResponse.json([
        { id: 'mock_patient_1', name: 'John Doe', email: 'john@example.com', age: 34 },
        { id: 'mock_patient_2', name: 'Jane Smith', email: 'jane@example.com', age: 28 },
      ], { status: 200 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, age, gender')
      .eq('role', 'patient')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('Error fetching patients:', err);
    return NextResponse.json({ message: 'Server error fetching patients' }, { status: 500 });
  }
}
