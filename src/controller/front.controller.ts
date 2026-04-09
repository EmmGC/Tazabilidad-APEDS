import { Response } from 'express';
import {getRelatedIDs} from '../service/front.service';

export const obtenerArrayIDs = async (req: any, res: Response) => {
  try {
    const { idNum } = req.params;
    const { idType } = req.params;
    const catalogo = await getRelatedIDs(Number(idNum), idType);
    return res.status(200).json(catalogo);
  } catch (error: any) {
    console.error("[CONTROLLER] Error en obtenerProveedores:", error.message);
    return res.status(500).json({ error: error.message });
  }
};