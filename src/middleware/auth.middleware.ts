import { Request, Response, NextFunction } from 'express';
import { supabase } from '../config/supabaseClient';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  try {
    // 1. Extraemos el header de Authorization
    const authHeader = req.headers.authorization;

    // 2. Verificamos que venga en formato "Bearer <token>"
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No se proporcionó un token válido' });
    }

    const token = authHeader.split(' ')[1];

    // 3. Le preguntamos a Supabase: "¿Quién es el dueño de este token?"
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Token inválido o sesión expirada' });
    }

    // 4. Guardamos el usuario en la 'petición' para que el siguiente middleware lo use
    req.user = user;
    
    next(); // ¡Pasa al siguiente nivel!
  } catch (err) {
    return res.status(500).json({ error: 'Error interno de autenticación' });
  }
};