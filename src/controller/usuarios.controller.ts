import { Response } from 'express';
import { login } from '../service/usuarios.service';

export const verificarUsuario = async (req: any, res: Response) => {
    try {
        const { email, password } = req.body
        const data = await login(email, password)
        res.json(data)
    } catch (error) {
        res.json(null)
    }
}