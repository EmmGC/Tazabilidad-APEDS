import { Router } from 'express';
import { verificarUsuario, getAllUsers } from '../controller/usuarios.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router()

router.post('/', verificarUsuario)

router.get('/getUsuarios', authMiddleware, getAllUsers)

export default router;