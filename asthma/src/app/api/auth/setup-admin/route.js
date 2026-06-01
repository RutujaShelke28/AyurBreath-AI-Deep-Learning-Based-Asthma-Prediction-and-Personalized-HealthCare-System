import { NextResponse } from 'next/server';
import { createUser, findUserByEmail } from '@/lib/models';

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ message: 'Supabase credentials not configured' }, { status: 500 });
    }

    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, supabaseKey);

    const existing = await findUserByEmail('admin@ayurbreath.com');
    if (existing) {
      await supabase.from('users').delete().eq('email', 'admin@ayurbreath.com');
    }
    
    await createUser({
      name: 'System Admin',
      email: 'admin@ayurbreath.com',
      password: 'admin123'
    });
    
    await supabase.from('users').update({ role: 'admin', is_approved: true }).eq('email', 'admin@ayurbreath.com');
    
    return NextResponse.json({ message: 'Admin user created successfully! You can now log in with admin@ayurbreath.com / admin123' });
  } catch (err) {
    return NextResponse.json({ message: 'Failed to setup admin', error: err.message }, { status: 500 });
  }
}
