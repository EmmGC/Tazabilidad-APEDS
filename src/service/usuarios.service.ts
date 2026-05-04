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

export const createUserService = async (email: string, password: string) => {
  const { data, error } = await supabaseUserAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true
  });

  if (error) throw error;

  // Insert into perfiles_usuarios using the same UUID
  const { error: profileError } = await supabaseUserAdmin
    .from('perfiles_usuarios')
    .insert({
      id: data.user.id,  // same UUID as auth.users
      nombre: email,
      rol: 'Administrador'
    });

  if (profileError) throw profileError;
  if (profileError) {
    await supabaseUserAdmin.auth.admin.deleteUser(data.user.id);
    throw profileError;
  }
  return data;
};