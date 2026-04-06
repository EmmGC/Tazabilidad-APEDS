import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { checkRole } from '../middleware/role.middleware';
import { crearInsumo, obtenerInsumos, obtenerInsumosUsados } from '../controller/insumos.controller';

const router = Router();

router.get('/getInsumosPorID/:id', obtenerInsumosUsados)
// GET: Cualquier usuario autenticado puede ver el catálogo (Alineado con tu política "Lectura universal")
router.get('/', authMiddleware, obtenerInsumos);

// POST: Solo Administrador y Recepcion pueden crear insumos (Alineado con "Escritura Ins")
router.post(
  '/', 
  authMiddleware, 
  checkRole(['Administrador', 'Recepcion']), 
  crearInsumo
);

export default router;