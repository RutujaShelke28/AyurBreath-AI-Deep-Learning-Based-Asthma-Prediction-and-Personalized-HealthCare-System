import { NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/authMiddleware';
import { findAssessmentsByUserId } from '@/lib/models';

export async function GET(req) {
  const { user, error } = await authenticateRequest(req);
  if (error) return NextResponse.json({ message: error }, { status: 401 });

  try {
    const assessments = await findAssessmentsByUserId(user.id, 10);
    return NextResponse.json(assessments);
  } catch {
    return NextResponse.json([]);
  }
}
