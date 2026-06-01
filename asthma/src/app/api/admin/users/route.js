import { NextResponse } from 'next/server';
import { getPendingDoctors, getApprovedDoctors, getPatients } from '@/lib/models';

export async function GET(req) {
  try {
    const pendingDoctors = await getPendingDoctors();
    const approvedDoctors = await getApprovedDoctors();
    const patients = await getPatients();
    
    return NextResponse.json({ 
      pendingDoctors, 
      approvedDoctors, 
      patients 
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'Server error', error: err.message }, { status: 500 });
  }
}
