import { NextResponse } from 'next/server';
import { getPendingDoctors } from '@/lib/models';
// Add basic auth/admin check if possible, or assume caller is admin for now.

export async function GET(req) {
  try {
    const doctors = await getPendingDoctors();
    return NextResponse.json({ doctors }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
