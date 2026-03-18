import { Response } from 'express';
import { obtenerRastreoBidireccionalService } from '../service/reportes.service';
import { generarPdfAuditoria } from '../utils/pdfGenerator';
import { generarQrMimetizado } from '../utils/qrGenerator';

export const rastrearLote = async (req: any, res: Response) => {
  try {
    const { codigo_trazabilidad } = req.params;
    if (!codigo_trazabilidad) return res.status(400).json({ error: "El código de trazabilidad es requerido." });

    const datos = await obtenerRastreoBidireccionalService(codigo_trazabilidad);
    return res.status(200).json(datos);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const auditarLotePdf = async (req: any, res: Response) => {
  try {
    const { codigo_trazabilidad } = req.params;
    if (!codigo_trazabilidad) return res.status(400).json({ error: "El código de trazabilidad es requerido." });

    // 1. Obtener la data bidireccional
    const datos = await obtenerRastreoBidireccionalService(codigo_trazabilidad);

    // 2. Generar Buffer de PDF
    const pdfBuffer = await generarPdfAuditoria(datos);

    // 3. Enviar como adjunto
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Auditoria_${codigo_trazabilidad}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    return res.end(pdfBuffer);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const generarQrCode = async (req: any, res: Response) => {
  try {
    const { codigo_trazabilidad } = req.params;
    if (!codigo_trazabilidad) return res.status(400).json({ error: "El código de trazabilidad es requerido." });

    // En la vida real, solo verificaríamos si el código existe primero
    // Aquí generamos el QR en base64 de inmediato
    const qrBase64 = await generarQrMimetizado(codigo_trazabilidad);
    
    return res.status(200).json({ qr_image: qrBase64 });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
