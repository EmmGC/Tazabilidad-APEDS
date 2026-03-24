import { Router } from 'express';
import { 
  crearBitacora, 
  crearLote, 
  obtenerLotes,
  obtenerLotePorID,
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
router.get('/getLotes', obtenerLotes);
router.get('/getLote/:id', obtenerLotePorID);

export default router;
