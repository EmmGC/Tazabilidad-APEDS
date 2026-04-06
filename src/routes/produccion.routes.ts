import { Router } from 'express';
import { 
  crearBitacora, 
  getBitacora,
  crearLote, 
  obtenerLotes,
  obtenerLotePorID,
  getSeccionCultivoPorID,
} from '../controller/produccion.controller';

const router = Router();

// ============================================
// Rutas de Producción: Bitácoras
// ============================================
router.post('/bitacora', crearBitacora);
router.get('/getBitacoraPorID/:id', getBitacora);


// ============================================
// Rutas de Producción: Lotes de Cosecha
// ============================================
router.post('/lotes', crearLote);
router.get('/getLotes', obtenerLotes);
router.get('/getLote/:id', obtenerLotePorID); 
// ============================================
// Rutas de Producción: Divisiones de cultivo
// ============================================
router.get('/getSeccionCultivoPorID/:id', getSeccionCultivoPorID);

export default router;
