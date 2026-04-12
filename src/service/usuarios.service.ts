import { supabase } from '../config/supabaseClient';
import { supabaseUserAdmin } from '../config/supabaseClient';

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

export const getAllUsersService = async () => {
  const { data, error } = await supabaseUserAdmin.auth.admin.listUsers();

  if (error) throw error
  return data
}

export const updateUserService = async (userId: string, updates: object) => {
  const { data, error } = await supabaseUserAdmin.auth.admin.updateUserById(
    userId,
    updates
  );

  if (error) throw error;
  return data;
};

export const deleteUserService = async (userId: string) => {
  const { data, error } = await supabaseUserAdmin.auth.admin.deleteUser(userId);

  if (error) throw error;
  return data;
};