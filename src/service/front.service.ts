import { supabase } from '../config/supabaseClient';

export const getRelatedIDs = async (number: number, idType: string) => {
  const { data, error } = await supabase
    .from('clientes_destinos')
    .select(`
      id_cliente,
      historial_transporte_lotes (
        id_transporte,
        transportes ( id_transporte ),
        lotes_cosecha (
          id_lote,
          secciones_cultivo (
            id_seccion,
            unidades_produccion ( id_unidad ),
            bitacora_actividades (
              id_actividad,
              detalle_aplicacion_insumos ( id_insumo )
            )
          )
        )
      )
    `)
    .eq(idType, number);

  if (error) {
    throw new Error(`Error al obtener array de IDs: ${error.message}`);
  }

  return data;
};