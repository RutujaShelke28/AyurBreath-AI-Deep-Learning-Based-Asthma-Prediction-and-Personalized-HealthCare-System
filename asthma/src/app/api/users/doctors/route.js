import { NextResponse } from 'next/server';
import supabase from '@/lib/supabase';

export async function GET(req) {
  try {
    if (!supabase) {
      // Mock doctors if DB is unavailable
      return NextResponse.json([
        { id: 'mock_doc_1', name: 'Dr. Alisha Chef', email: 'alisha@care.com', specialization: 'Ayurvedic Pulmonology', experience: '12 years' },
        { id: 'mock_doc_2', name: 'Dr. Raj Patel', email: 'raj@ayur.com', specialization: 'Respiratory Wellness', experience: '8 years' },
      ], { status: 200 });
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, name, email')
      .eq('role', 'doctor')
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Append mock details for visual presentation if real data lacks it
    const formattedData = data.map(doc => ({
      ...doc,
      specialization: doc.specialization || 'Ayurvedic Pulmonology',
      experience: doc.experience || '10+ years'
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (err) {
    console.error('Error fetching doctors:', err);
    return NextResponse.json({ message: 'Server error fetching doctors' }, { status: 500 });
  }
}
