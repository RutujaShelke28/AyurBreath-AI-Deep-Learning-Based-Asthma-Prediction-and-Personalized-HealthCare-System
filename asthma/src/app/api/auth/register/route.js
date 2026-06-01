import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail } from '@/lib/models';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'ayurbreath-jwt-secret-change-in-production', { expiresIn: '7d' });

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      name, email, password, age, gender, asthma_history, health_notes,
      role, doctor_certificate, license, graduation_institute, passout_year
    } = body;

    if (!name || !email || !password || password.length < 8) {
      return NextResponse.json({ message: 'Invalid input data' }, { status: 400 });
    }

    try {
      const existing = await findUserByEmail(email);
      if (existing) {
        return NextResponse.json({ message: 'Email already registered' }, { status: 400 });
      }
    } catch {
      // DB unavailable
    }

    let userId = 'local_' + Date.now();
    let token;

    try {
      const user = await createUser({
        name, email, password, age, gender,
        asthmaHistory: asthma_history,
        healthNotes: health_notes,
        role,
        doctorCertificate: doctor_certificate,
        license,
        graduationInstitute: graduation_institute,
        passoutYear: passout_year
      });
      userId = user.id;
      token = signToken(user.id);
      return NextResponse.json({ token, user }, { status: 201 });
    } catch (dbErr) {
      // DB unavailable — issue token with temp ID
      token = signToken(userId);
      return NextResponse.json({
        token,
        user: { id: userId, name, email, age, gender }
      }, { status: 201 });
    }
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
