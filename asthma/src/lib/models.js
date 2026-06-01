import bcrypt from 'bcryptjs';
import supabase from './supabase';

// --- User Models ---

export async function createUser({ 
  name, email, password, age, gender, asthmaHistory, healthNotes,
  role = 'patient', doctorCertificate, license, graduationInstitute, passoutYear
}) {
  if (!supabase) throw new Error("Database unavailable");
  const hashedPassword = await bcrypt.hash(password, 12);

  const isApproved = role === 'doctor' ? false : true;

  const { data, error } = await supabase
    .from('users')
    .insert({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      age: age || null,
      gender: gender || null,
      asthma_history: asthmaHistory || null,
      health_notes: healthNotes || null,
      role: role,
      is_approved: isApproved,
      doctor_certificate: doctorCertificate || null,
      license: license || null,
      graduation_institute: graduationInstitute || null,
      passout_year: passoutYear || null
    })
    .select()
    .single();

  if (error) throw error;
  return toSafeObject(data);
}

export async function getPendingDoctors() {
  if (!supabase) throw new Error("Database unavailable");
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'doctor')
    .eq('is_approved', false);

  if (error) throw error;
  return data.map(toSafeObject);
}

export async function getApprovedDoctors() {
  if (!supabase) throw new Error("Database unavailable");
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'doctor')
    .eq('is_approved', true);

  if (error) throw error;
  return data.map(toSafeObject);
}

export async function getPatients() {
  if (!supabase) throw new Error("Database unavailable");
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('role', 'patient');

  if (error) throw error;
  return data.map(toSafeObject);
}

export async function approveDoctor(doctorId) {
  if (!supabase) throw new Error("Database unavailable");
  const { data, error } = await supabase
    .from('users')
    .update({ is_approved: true })
    .eq('id', doctorId)
    .select()
    .single();

  if (error) throw error;
  return toSafeObject(data);
}

export async function findUserByEmail(email) {
  if (!supabase) throw new Error("Database unavailable");
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();

  if (error && error.code === 'PGRST116') return null; // not found
  if (error) throw error;
  return data;
}

export async function findUserById(id) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code === 'PGRST116') return null;
  if (error) throw error;
  return toSafeObject(data);
}

export async function updateUser(id, updates) {
  if (!supabase) throw new Error("Database unavailable");
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return toSafeObject(data);
}

export function comparePassword(candidate, hash) {
  return bcrypt.compare(candidate, hash);
}

export function toSafeObject(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

// --- Assessment Models ---

export async function createAssessment({ userId, answers, dosha, severity, score, aiPrediction }) {
  if (!supabase) throw new Error("Database unavailable");
  const { data, error } = await supabase
    .from('assessments')
    .insert({
      user_id: userId,
      answers,
      dosha: dosha || null,
      severity: severity || null,
      score: score != null ? score : null,
      ai_prediction: aiPrediction || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function findAssessmentsByUserId(userId, limit = 10) {
  if (!supabase) throw new Error("Database unavailable");
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
