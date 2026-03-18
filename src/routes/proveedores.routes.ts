import { Router } from 'express';
import { 
  crearProveedor, 
  obtenerProveedores, 
  crearRecepcion, 
  obtenerRecepciones 
} from '../controller/proveedores.controller';

const router = Router();

// ============================================
// Rutas de Insumos: Proveedores
// ============================================
router.post('/proveedores', crearProveedor);
router.get('/proveedores', obtenerProveedores);

// ============================================
// Rutas de Insumos: Recepción de Insumos
// ============================================
router.post('/recepcion', crearRecepcion);
router.get('/recepcion', obtenerRecepciones);

export default router;
