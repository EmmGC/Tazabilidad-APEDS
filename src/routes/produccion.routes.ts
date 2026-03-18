import { Router } from 'express';
import { 
  crearBitacora, 
  crearLote, 
  obtenerLotes 
} from '../controller/produccion.controller';

const router = Router();

// ============================================
// Rutas de Producción: Bitácoras
// ============================================
router.post('/bitacora', crearBitacora);

// ============================================
// Rutas de Producción: Lotes de Cosecha
// ============================================
router.post('/lotes', crearLote);
router.get('/lotes', obtenerLotes);

export default router;
