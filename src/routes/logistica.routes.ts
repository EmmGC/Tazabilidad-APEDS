import { Router } from 'express';
import { 
  crearCliente, obtenerClientes,
  crearTransporte, obtenerTransportes,
  despacharEmbarque, registrarLlegadaEmbarque, obtenerEmbarques
} from '../controller/logistica.controller';

const router = Router();

// ============================================
// Rutas de Logística: Clientes y Transportes
// ============================================
router.post('/clientes', crearCliente);
router.get('/clientes', obtenerClientes);

router.post('/transportes', crearTransporte);
router.get('/transportes', obtenerTransportes);

// ============================================
// Rutas de Logística: Embarques y Lotes
// ============================================
router.post('/embarques', despacharEmbarque);
router.put('/embarques/:id_historial/llegada', registrarLlegadaEmbarque);
router.get('/embarques', obtenerEmbarques);

export default router;
