import { Response } from 'express';
import { 
  registrarProveedorService, 
  obtenerProveedoresService, 
  registrarRecepcionService, 
  obtenerRecepcionesService,
  obtenerInfoProvePorIDService
} from '../service/proveedores.service';
import { ProveedorData, RecepcionInsumoData } from '../types/proveedores.types';

export const crearProveedor = async (req: any, res: Response) => {
  try {
    const data: ProveedorData = req.body;

    if (!data.nombre_empresa) {
      return res.status(400).json({ error: "El nombre de la empresa proveedora es obligatorio." });
    }

    const resultado = await registrarProveedorService(data);

    return res.status(201).json({
      mensaje: "Proveedor registrado correctamente.",
      data: resultado
    });
  } catch (error: any) {
    console.error("[CONTROLLER] Error en crearProveedor:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerProveedores = async (req: any, res: Response) => {
  try {
    const catalogo = await obtenerProveedoresService();
    return res.status(200).json(catalogo);
  } catch (error: any) {
    console.error("[CONTROLLER] Error en obtenerProveedores:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerInfoProvePorID = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const catalogo = await obtenerInfoProvePorIDService(Number(id));
    return res.status(200).json(catalogo);
  } catch (error: any) {
    console.error("[CONTROLLER] Error en obtenerProveedores:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const crearRecepcion = async (req: any, res: Response) => {
  try {
    const data: RecepcionInsumoData = req.body;

    if (!data.id_proveedor || !data.id_insumo_agricola || !data.cantidad || !data.lote_insumo) {
      return res.status(400).json({ 
        error: "Faltan datos obligatorios para la recepción (proveedor, insumo, cantidad, lote)." 
      });
    }

    const resultado = await registrarRecepcionService(data);

    return res.status(201).json({
      mensaje: "Recepción de insumo registrada correctamente.",
      data: resultado
    });
  } catch (error: any) {
    console.error("[CONTROLLER] Error en crearRecepcion:", error.message);
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerRecepciones = async (req: any, res: Response) => {
  try {
    const catalogo = await obtenerRecepcionesService();
    return res.status(200).json(catalogo);
  } catch (error: any) {
    console.error("[CONTROLLER] Error en obtenerRecepciones:", error.message);
    return res.status(500).json({ error: error.message });
  }
};
