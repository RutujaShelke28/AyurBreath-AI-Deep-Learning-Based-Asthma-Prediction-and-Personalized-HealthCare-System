import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { findUserByEmail, comparePassword, toSafeObject } from '@/lib/models';

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET || 'ayurbreath-jwt-secret-change-in-production', { expiresIn: '7d' });

export async function POST(req) {
  try {
    const { email, password, role } = await req.json();

    try {
      console.log('Login attempt for email:', email);
      const user = await findUserByEmail(email);
      console.log('User found:', user ? 'Yes' : 'No');
      
      let passwordMatch = false;
      if (user) {
        passwordMatch = await comparePassword(password, user.password);
        console.log('Password match:', passwordMatch);
      }

      if (!user || !passwordMatch) {
        return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 });
      }

      if (role && user.role !== role) {
        return NextResponse.json({ message: `Access denied. You are registered as a ${user.role}, but tried to log in as a ${role}.` }, { status: 403 });
      }

      if (user.role === 'doctor' && user.is_approved === false) {
        return NextResponse.json({ message: 'Your doctor registration is pending admin approval.' }, { status: 403 });
      }

      const token = signToken(user.id);
      return NextResponse.json({ token, user: toSafeObject(user) });
    } catch {
      // DB unavailable — optional demo login for local development
      if (
        process.env.ALLOW_DEMO_LOGIN === 'true' &&
        email === 'demo@ayurbreath.ai' &&
        password === 'demo12345'
      ) {
        const userId = 'demo_user';
        return NextResponse.json({
          token: signToken(userId),
          user: { id: userId, name: 'Demo User', email },
        });
      }
      return NextResponse.json({
        message: 'Database unavailable. Configure SUPABASE_URL and SUPABASE_KEY in .env.local, or use Try Demo on the login page.',
      }, { status: 503 });
    }
  } catch (err) {
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
