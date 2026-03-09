import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Validación de seguridad para que el servidor no arranque si faltan las llaves
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Faltan las variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);