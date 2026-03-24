import { supabase } from '../config/supabaseClient';
import { UnidadProduccionData, SeccionCultivoData } from '../types/up.types';

export const registrarUPService = async (data: UnidadProduccionData) => {
  const { data: result, error } = await supabase
    .from('unidades_produccion')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar UP: ${error.message}`);
  }

  return result;
};

export const obtenerUPsService = async () => {
  const { data, error } = await supabase
    .from('unidades_produccion')
    .select('*')
    .order('id_unidad', { ascending: true });

  if (error) {
    throw new Error(`Error al obtener UPs: ${error.message}`);
  }

  return data;
};

export const obtenerUPporIDService = async (number: number) => {
  const { data, error } = await supabase
    .from('unidades_produccion')
    .select('*')
    .eq("id_unidad", number)
    .order('id_unidad', { ascending: true });

  if (error) {
    throw new Error(`Error al obtener UPs: ${error.message}`);
  }

  return data;
};

export const registrarSeccionService = async (data: SeccionCultivoData) => {
  const { data: result, error } = await supabase
    .from('secciones_cultivo')
    .insert([data])
    .select()
    .single();

  if (error) {
    throw new Error(`Error al registrar Sección: ${error.message}`);
  }

  return result;
};

export const obtenerSeccionesService = async (id_unidad: number) => {
  const { data, error } = await supabase
    .from('secciones_cultivo')
    .select(`
      *,
      unidades_produccion ( nombre_unidad )
    `)
    .eq('id_unidad', id_unidad)
    .order('id_seccion', { ascending: true });
  if (error) {
    throw new Error(`Error al obtener Secciones: ${error.message}`);
  }

  return data;
};
