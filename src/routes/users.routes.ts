import { Router } from 'express';
import { verificarUsuario, getAllUsers, updateUser, deleteUser, createUser, getAllTelegramUsers, createTelegramUser, updateTelegramUser, deleteTelegramUser} from '../controller/usuarios.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router()

router.post('/', verificarUsuario)

//Usuarios admin
router.get('/getUsuarios', authMiddleware, getAllUsers)
router.put('/updateUser', authMiddleware, updateUser)
router.delete('/deleteUser', authMiddleware, deleteUser)
router.post('/createUsuario', authMiddleware, createUser)
//Usuarios telegram
router.get('/getTelegram', authMiddleware, getAllTelegramUsers)
router.post('/createTelegram', authMiddleware, createTelegramUser)
router.put('/updateTelegram', authMiddleware, updateTelegramUser)
router.delete('/deleteTelegram', authMiddleware, deleteTelegramUser)


export default router;