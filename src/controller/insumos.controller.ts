import { Response } from 'express';
import { registrarInsumoService, obtenerCatologoInsumosService, InsumoData } from '../service/insumos.service';

/**
 * POST: Crea un nuevo registro de Insumo Agrícola
 */
export const crearInsumo = async (req: any, res: Response) => {
  try {
    const { 
      nombre_comercial, 
      ingrediente_activo, 
      formulacion, 
      presentacion, 
      registro_cofepris 
    } = req.body;

    // 1. Validación Estructural: Exigimos los datos mínimos vitales
    if (!nombre_comercial || !ingrediente_activo || !registro_cofepris) {
      return res.status(400).json({ 
        error: "Faltan datos obligatorios: nombre_comercial, ingrediente_activo o registro_cofepris." 
      });
    }

    // 2. Empaquetado de datos
    const nuevoInsumo: InsumoData = {
      nombre_comercial,
      ingrediente_activo,
      formulacion: formulacion || 'N/A', // Valor por defecto si no lo envían
      presentacion: presentacion || 'N/A',
      registro_cofepris
    };

    // 3. Llamada a la capa de Servicio
    const resultado = await registrarInsumoService(nuevoInsumo);

    // 4. Respuesta exitosa al cliente
    return res.status(201).json({
      mensaje: "Insumo agrícola registrado correctamente.",
      data: resultado
    });

  } catch (error: any) {
    console.error("[CONTROLLER] Error en crearInsumo:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * GET: Devuelve la lista de Insumos
 */
export const obtenerInsumos = async (req: any, res: Response) => {
  try {
    const catalogo = await obtenerCatologoInsumosService();
    return res.status(200).json(catalogo);
  } catch (error: any) {
    console.error("[CONTROLLER] Error en obtenerInsumos:", error.message);
    return res.status(500).json({ error: error.message });
  }
};