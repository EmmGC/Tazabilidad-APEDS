import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const secretUserAccessKey = process.env.USER_ACESS;

// Validación de seguridad para que el servidor no arranque si faltan las llaves
if (!supabaseUrl || !supabaseAnonKey || !secretUserAccessKey) {
  throw new Error("Faltan las variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY o USER_ACESS");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseUserAdmin = createClient(supabaseUrl, secretUserAccessKey);