import { supabase } from '../config/supabaseClient';

export const getRelatedIDs = async (number: number, idType: string) => {
  const allowedColumns = ['id_cliente', 'id_transporte', 'id_lote', 'id_seccion', 'id_unidad', 'id_actividad', 'id_insumo'];
  if (!allowedColumns.includes(idType)) throw new Error(`idType no soportado: ${idType}`);

  const { data, error } = await supabase.rpc('get_related_ids', {
    p_id: number,
    p_id_type: idType,
  });

  if (error) throw new Error(`Error al obtener array de IDs: ${error.message}`);
  return data;
};