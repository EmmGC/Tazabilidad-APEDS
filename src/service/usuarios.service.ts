import { supabase } from '../config/supabaseClient';

export interface usuarios {
    correo: string,
    contraseña: string,
    rol: string
}

export const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error
  return data
}