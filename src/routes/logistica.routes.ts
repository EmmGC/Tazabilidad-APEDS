import { Router } from 'express';
import { 
  crearCliente, obtenerClientes, obtenerClientesPorID,
  crearTransporte, obtenerTransportes, obtenerTransportesPorID,
  despacharEmbarque, registrarLlegadaEmbarque, obtenerEmbarques, obtenerEmbarquesPorID, obtenerLotesPorID
} from '../controller/logistica.controller';

const router = Router();

// ============================================
// Rutas de Logística: Clientes y Transportes
// ============================================
router.post('/clientes', crearCliente);
router.get('/clientes', obtenerClientes);
router.get('/getClientesPorID/:id', obtenerClientesPorID);

router.post('/transportes', crearTransporte);
router.get('/transportes', obtenerTransportes);
router.get('/getTransportesPorID/:id', obtenerTransportesPorID);

// ============================================
// Rutas de Logística: Embarques y Lotes
// ============================================
router.post('/embarques', despacharEmbarque);
router.put('/embarques/:id_historial/llegada', registrarLlegadaEmbarque);
router.get('/embarques', obtenerEmbarques);
router.get('/getEmbarquesPorID/:id', obtenerEmbarquesPorID);
router.get('/getLotePorID/:id',obtenerLotesPorID);
export default router;
