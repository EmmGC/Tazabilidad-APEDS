import { Request, Response } from 'express';
import { 
  registrarBitacoraService, 
  registrarLoteCosechaService, 
  obtenerLotesService,
  obtenerLotePorIDService
} from '../service/produccion.service';
import { BitacoraActividadData, LoteCosechaData } from '../types/produccion.types';

export const crearBitacora = async (req: any, res: Response) => {
  try {
    const data: BitacoraActividadData = req.body;
    const detalles = req.body.detalles || []; // Opcional, aplicación de insumos

    if (!data.id_seccion || !data.tipo_actividad) {
      return res.status(400).json({ error: "id_seccion y tipo_actividad son obligatorios para la bitácora." });
    }

    const resultado = await registrarBitacoraService(data, detalles);

    return res.status(201).json({
      mensaje: "Bitácora de actividad registrada correctamente.",
      data: resultado
    });
  } catch (error: any) {
    console.error("[CONTROLLER] Error en crearBitacora:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const crearLote = async (req: any, res: Response) => {
  try {
    const data: LoteCosechaData = req.body;

    if (!data.id_seccion || !data.cantidad_cajas || !data.peso_kg) {
      return res.status(400).json({ 
        error: "Faltan datos obligatorios para el lote de cosecha (id_seccion, cantidad_cajas, peso_kg)." 
      });
    }

    const resultado = await registrarLoteCosechaService(data);

    return res.status(201).json({
      mensaje: "Lote de cosecha y Código de Trazabilidad generados correctamente.",
      data: resultado
    });
  } catch (error: any) {
    console.error("[CONTROLLER] Error en crearLote:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerLotes = async (req: any, res: Response) => {
  try {
    const catalogo = await obtenerLotesService();
    return res.status(200).json(catalogo);
  } catch (error: any) {
    console.error("[CONTROLLER] Error en obtenerLotes:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerLotePorID = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const catalogo = await obtenerLotePorIDService(Number(id));
    return res.status(200).json(catalogo);
  } catch (error: any) {
    console.error("[CONTROLLER] Error en obtenerLotes:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
