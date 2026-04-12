import { Router } from 'express';
import { verificarUsuario, getAllUsers, updateUser, deleteUser} from '../controller/usuarios.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router()

router.post('/', verificarUsuario)

router.get('/getUsuarios', authMiddleware, getAllUsers)
router.put('/updateUser', authMiddleware, updateUser)
router.delete('/deleteUser', authMiddleware, deleteUser)

export default router;