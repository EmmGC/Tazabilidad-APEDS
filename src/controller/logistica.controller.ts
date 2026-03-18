import { Response } from 'express';
import { 
  registrarClienteService, 
  obtenerClientesService,
  registrarTransporteService,
  obtenerTransportesService,
  registrarEmbarqueService,
  actualizarLlegadaEmbarqueService,
  obtenerEmbarquesService
} from '../service/logistica.service';
import { 
  ClienteDestinoData, 
  TransporteData, 
  HistorialTransporteLoteData 
} from '../types/logistica.types';

export const crearCliente = async (req: any, res: Response) => {
  try {
    const data: ClienteDestinoData = req.body;
    if (!data.nombre_empresa) return res.status(400).json({ error: "El nombre de la empresa destino es obligatorio." });
    
    const resultado = await registrarClienteService(data);
    return res.status(201).json({ mensaje: "Cliente registrado correctamente.", data: resultado });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerClientes = async (req: any, res: Response) => {
  try {
    const catalogo = await obtenerClientesService();
    return res.status(200).json(catalogo);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const crearTransporte = async (req: any, res: Response) => {
  try {
    const data: TransporteData = req.body;
    if (!data.placas || !data.tipo_vehiculo) return res.status(400).json({ error: "Las placas y tipo de vehículo son obligatorios." });
    
    const resultado = await registrarTransporteService(data);
    return res.status(201).json({ mensaje: "Transporte registrado correctamente.", data: resultado });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerTransportes = async (req: any, res: Response) => {
  try {
    const catalogo = await obtenerTransportesService();
    return res.status(200).json(catalogo);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const despacharEmbarque = async (req: any, res: Response) => {
  try {
    const data: HistorialTransporteLoteData = req.body;
    if (!data.id_transporte || !data.id_lote || !data.id_cliente || !data.cajas_transportadas || !data.peso_transportado_kg) {
      return res.status(400).json({ error: "Faltan datos obligatorios para el despacho del embarque." });
    }
    
    const resultado = await registrarEmbarqueService(data);
    return res.status(201).json({ mensaje: "Embarque despachado correctamente.", data: resultado });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const registrarLlegadaEmbarque = async (req: any, res: Response) => {
  try {
    const { id_historial } = req.params;
    if (!id_historial) return res.status(400).json({ error: "EL parámetro id_historial es requerido." });

    const data: Partial<HistorialTransporteLoteData> = req.body;
    data.fecha_llegada = data.fecha_llegada || new Date().toISOString(); 
    
    const resultado = await actualizarLlegadaEmbarqueService(Number(id_historial), data);
    return res.status(200).json({ mensaje: "Llegada de embarque registrada.", data: resultado });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const obtenerEmbarques = async (req: any, res: Response) => {
  try {
    const catalogo = await obtenerEmbarquesService();
    return res.status(200).json(catalogo);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};
