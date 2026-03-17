import { Router } from 'express';
import { verificarUsuario } from '../controller/usuarios.controller';
const router = Router()

router.get('/', verificarUsuario)

export default router;