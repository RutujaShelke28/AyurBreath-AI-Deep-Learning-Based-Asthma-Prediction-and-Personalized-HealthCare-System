import { NextResponse } from 'next/server';
import { approveDoctor } from '@/lib/models';

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ message: 'Doctor ID is required' }, { status: 400 });
    }

    const doctor = await approveDoctor(id);
    return NextResponse.json({ message: 'Doctor approved successfully', doctor }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
