import { Router } from 'express';
import { 
  rastrearLote, 
  auditarLotePdf,
  generarQrCode
} from '../controller/reportes.controller';

const router = Router();

// ============================================
// Rutas de Módulo 5: Recall / Trazabilidad
// ============================================
router.get('/trazabilidad/:codigo_trazabilidad', rastrearLote);
router.get('/trazabilidad/:codigo_trazabilidad/pdf', auditarLotePdf);
router.get('/trazabilidad/:codigo_trazabilidad/qr', generarQrCode);

export default router;
