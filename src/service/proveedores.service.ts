import { supabase } from '../config/supabaseClient';
import { ProveedorData, RecepcionInsumoData } from '../types/proveedores.types';

export const registrarProveedorService = async (data: ProveedorData) => {
  const { data: result, error } = await supabase
    .from('proveedores')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar Proveedor: ${error.message}`);
  }

  return result;
};

export const obtenerProveedoresService = async () => {
  const { data, error } = await supabase
    .from('proveedores')
    .select('*')
    .order('id_proveedor', { ascending: true });

  if (error) {
    throw new Error(`Error al obtener Proveedores: ${error.message}`);
  }

  return data;
};

export const registrarRecepcionService = async (data: RecepcionInsumoData) => {
  const { data: result, error } = await supabase
    .from('recepcion_insumos')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar Recepción de Insumo: ${error.message}`);
  }

  return result;
};

export const obtenerRecepcionesService = async () => {
  const { data, error } = await supabase
    .from('recepcion_insumos')
    .select(`
      *,
      proveedores ( nombre_empresa ),
      insumos_agricolas ( nombre_comercial, registro_cofepris )
    `)
    .order('fecha_recepcion', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener Recepciones: ${error.message}`);
  }

  return data;
};
