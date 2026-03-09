import { Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';
import { Database } from '../types/database.type';

// Tipado estricto basado en la base de datos
type UserRole = Database['public']['Tables']['Perfiles_Usuarios']['Row']['rol'];

export const checkRole = (rolesPermitidos: UserRole[]) => {
  return async (req: any, res: Response, next: NextFunction) => {
    try {
      // 1. Buscamos el perfil en la tabla pública usando el ID que nos dio el Auth
      const { data: perfil, error } = await supabase
        .from('Perfiles_Usuarios')
        .select('rol')
        .eq('id', req.user.id)
        .single();

      if (error || !perfil) {
        return res.status(404).json({ error: 'El perfil de usuario no existe' });
      }

      // 2. validacion
      if (!rolesPermitidos.includes(perfil.rol)) {
        return res.status(403).json({ 
          error: `Acceso denegado. Se requiere uno de estos roles: ${rolesPermitidos.join(', ')}` 
        });
      }

      // 3. Todo en orden Puede proceder
      next();
    } catch (err) {
      return res.status(500).json({ error: 'Error al verificar permisos de rol' });
    }
  };
};