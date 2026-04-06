import { Response } from 'express';
import { login } from '../service/usuarios.service';

export const verificarUsuario = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body;
        const data = await login(email, password);
        res.status(200).json(data);
    } catch (error: any) {
        // Error de Supabase por credenciales inválidas
        if (error.message && error.message.includes('Invalid login credentials')) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }
        // Otros errores del servidor
        console.error('Error en verificarUsuario:', error);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
}