import { Response } from 'express';
import { 
  registrarUPService, 
  obtenerUPsService, 
  registrarSeccionService, 
  obtenerSeccionesService 
} from '../service/up.service';
import { UnidadProduccionData, SeccionCultivoData } from '../types/up.types';

export const crearUP = async (req: any, res: Response) => {
  try {
    const data: UnidadProduccionData = req.body;

    if (!data.nombre_unidad || !data.codigo_estado || !data.codigo_municipio || !data.numero_up) {
      return res.status(400).json({ 
        error: "Faltan datos obligatorios para crear la Unidad de Producción (nombre, y códigos geográficos)." 
      });
    }

    const resultado = await registrarUPService(data);

    return res.status(201).json({
      mensaje: "Unidad de Producción registrada correctamente.",
      data: resultado
    });
  } catch (error: any) {
    console.error("[CONTROLLER] Error en crearUP:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerUPs = async (req: any, res: Response) => {
  try {
    const catalogo = await obtenerUPsService();
    return res.status(200).json(catalogo);
  } catch (error: any) {
    console.error("[CONTROLLER] Error en obtenerUPs:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const crearSeccion = async (req: any, res: Response) => {
  try {
    const data: SeccionCultivoData = req.body;

    if (!data.id_unidad || !data.nombre_seccion || !data.codigo_seccion || !data.codigo_cultivo || !data.codigo_variedad) {
      return res.status(400).json({ 
        error: "Faltan datos obligatorios para crear la Sección (id_unidad, nombre, y códigos de sección/cultivo/variedad)." 
      });
    }

    const resultado = await registrarSeccionService(data);

    return res.status(201).json({
      mensaje: "Sección de cultivo registrada correctamente.",
      data: resultado
    });
  } catch (error: any) {
    console.error("[CONTROLLER] Error en crearSeccion:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerSecciones = async (req: any, res: Response) => {
  try {
    const { id_unidad } = req.params;
    
    if (!id_unidad) {
      return res.status(400).json({ error: "El parámetro id_unidad es requerido." });
    }

    const catalogo = await obtenerSeccionesService(Number(id_unidad));
    return res.status(200).json(catalogo);
  } catch (error: any) {
    console.error("[CONTROLLER] Error en obtenerSecciones:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
