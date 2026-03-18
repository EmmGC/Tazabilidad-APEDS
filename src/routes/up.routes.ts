import { Router } from 'express';
import { 
  crearUP, 
  obtenerUPs, 
  crearSeccion, 
  obtenerSecciones 
} from '../controller/up.controller';
// import { requireAuth } from '../middleware/auth.middleware'; // Opcional, dependiendo de cómo manejes la auth

const router = Router();

// ============================================
// Rutas de Identidad: Unidades de Producción
// ============================================

// TODO: Agregar middleware de autenticación/RBAC cuando esté listo
router.post('/unidades', crearUP);
router.get('/unidades', obtenerUPs);

// ============================================
// Rutas de Identidad: Secciones y Cultivos
// ============================================
router.post('/secciones', crearSeccion);
router.get('/secciones/:id_unidad', obtenerSecciones);

export default router;
