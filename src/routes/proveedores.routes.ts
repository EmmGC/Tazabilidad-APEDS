import { Router } from 'express';
import { 
  crearProveedor, 
  obtenerProveedores, 
  crearRecepcion, 
  obtenerRecepciones ,
  obtenerInfoProvePorID
} from '../controller/proveedores.controller';

const router = Router();

// ============================================
// Rutas de Insumos: Proveedores
// ============================================
router.post('/proveedores', crearProveedor);
router.get('/proveedores', obtenerProveedores);
router.get('/getInfoProvePorID/:id', obtenerInfoProvePorID);

// ============================================
// Rutas de Insumos: Recepción de Insumos
// ============================================
router.post('/recepcion', crearRecepcion);
router.get('/recepcion', obtenerRecepciones);

export default router;
