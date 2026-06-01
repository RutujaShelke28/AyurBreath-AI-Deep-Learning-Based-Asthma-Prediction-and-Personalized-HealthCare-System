import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/authMiddleware';
import { updateUser } from '@/lib/models';

export async function PUT(req) {
  const { user, error } = await authenticateRequest(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    const body = await req.json();
    
    // Allow updating specific fields
    const updates = {};
    if (body.name) updates.name = body.name;
    if (body.age !== undefined) updates.age = body.age;
    if (body.gender) updates.gender = body.gender;
    if (body.asthmaHistory) updates.asthma_history = body.asthmaHistory;
    if (body.healthNotes) updates.health_notes = body.healthNotes;
    
    // For doctors
    if (body.doctorCertificate !== undefined) updates.doctor_certificate = body.doctorCertificate;
    if (body.license !== undefined) updates.license = body.license;
    if (body.graduationInstitute !== undefined) updates.graduation_institute = body.graduationInstitute;
    if (body.passoutYear !== undefined) updates.passout_year = body.passoutYear;

    const updatedUser = await updateUser(user.id, updates);
    
    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error('Failed to update profile:', err);
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 });
  }
}
