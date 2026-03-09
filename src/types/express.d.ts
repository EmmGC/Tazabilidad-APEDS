import { User } from '@supabase/supabase-js';
declare global {
  namespace Express {
    interface Request {
      // Definimos que 'user' es opcional (?) porque no todas 
      // las rutas requieren estar logueado, y usamos el tipo de Supabase.
      user?: User;
    }
  }
}