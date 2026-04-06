import { Router } from 'express';
import { verificarUsuario } from '../controller/usuarios.controller';
const router = Router()

router.post('/', verificarUsuario)

export default router;