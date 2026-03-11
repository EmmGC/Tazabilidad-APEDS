import { supabase } from '../config/supabaseClient';

// Definimos una interfaz para asegurar el tipado de los datos de entrada
export interface InsumoData {
  nombre_comercial: string;
  ingrediente_activo: string;
  formulacion: string;
  presentacion: string;
  registro_cofepris: string;
}

/**
 * Registra un nuevo insumo agrícola en la base de datos.
 */
export const registrarInsumoService = async (datosInsumo: InsumoData) => {
  const { data, error } = await supabase
    .from('insumos_agricolas') // Nombre exacto de la tabla en Postgres
    .insert([datosInsumo])
    .select()
    .single();

  if (error) {
    throw new Error(`Error en BD al registrar insumo: ${error.message}`);
  }

  return data;
};

/**
 * Obtiene el catálogo completo de insumos agrícolas.
 */
export const obtenerCatologoInsumosService = async () => {
  const { data, error } = await supabase
    .from('insumos_agricolas')
    .select('*')
    .order('nombre_comercial', { ascending: true });

  if (error) {
    throw new Error(`Error en BD al consultar insumos: ${error.message}`);
  }

  return data;
};