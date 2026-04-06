import { supabase } from '../config/supabaseClient';
import { 
  BitacoraActividadData, 
  DetalleAplicacionInsumoData, 
  LoteCosechaData 
} from '../types/produccion.types';

// ==========================================
// 1. Bitácoras y Aplicaciones
// ==========================================

export const registrarBitacoraService = async (data: BitacoraActividadData, detallesInsumos?: DetalleAplicacionInsumoData[]) => {
  // 1. Insertar la bitácora
  const { data: bitacora, error: errorBitacora } = await supabase
    .from('bitacora_actividades')
    .insert([data])
    .select()
    .single();

  if (errorBitacora) throw new Error(`Error al registrar Bitácora: ${errorBitacora.message}`);

  // 2. Si vienen detalles (Insumos aplicados), los insertamos
  if (detallesInsumos && detallesInsumos.length > 0) {
    const detallesConId = detallesInsumos.map(d => ({
      ...d,
      id_actividad: bitacora.id_actividad
    }));

    const { error: errorDetalles } = await supabase
      .from('detalle_aplicacion_insumos')
      .insert(detallesConId);

    if (errorDetalles) throw new Error(`Error al registrar Detalles de Insumos: ${errorDetalles.message}`);
  }

  return bitacora;
};

import { getJulianDay } from '../utils/trazabilidad.utils';

// ==========================================
// 2. Lotes de Cosecha y Trazabilidad Central
// ==========================================

export const registrarLoteCosechaService = async (data: LoteCosechaData) => {
  // 1. Calcular Fecha Juliana y Año (REQ-DOC-08) usando la utilidad existente en utils
  const fechaToUse = data.fecha_cosecha ? new Date(data.fecha_cosecha) : new Date();
  data.fecha_juliana = Number(getJulianDay(fechaToUse));
  data.anio_cosecha = fechaToUse.getFullYear();

  // 2. Insertar Lote inicialmente sin el código (se calcula con la vista)
  const { data: loteNuevo, error: errorInsert } = await supabase
    .from('lotes_cosecha')
    .insert([data])
    .select()
    .single();

  if (errorInsert) throw new Error(`Error al registrar Lote: ${errorInsert.message}`);

  // 3. Consultar la Vista Maestra de Trazabilidad para obtener el Código generado
  const { data: vistaTrazabilidad, error: errorVista } = await supabase
    .from('vista_codigo_trazabilidad')
    .select('codigo_trazabilidad_oficial')
    .eq('id_lote', loteNuevo.id_lote)
    .single();

  if (errorVista) throw new Error(`Error al leer Vista Trazabilidad: ${errorVista.message}`);

  const codigoOficial = vistaTrazabilidad.codigo_trazabilidad_oficial;

  // 4. Actualizar el Lote insertado con su super Código de Trazabilidad
  const { data: loteFinal, error: errorUpdate } = await supabase
    .from('lotes_cosecha')
    .update({ codigo_trazabilidad: codigoOficial })
    .eq('id_lote', loteNuevo.id_lote)
    .select()
    .single();

  if (errorUpdate) throw new Error(`Error al guardar Código en el Lote: ${errorUpdate.message}`);

  return loteFinal;
};

export const obtenerLotesService = async () => {
  const { data, error } = await supabase
    .from('lotes_cosecha')
    .select(`
      *,
      secciones_cultivo ( nombre_seccion, cultivo, variedad )
    `)
    .order('fecha_cosecha', { ascending: false });

  if (error) {
    throw new Error(`Error al obtener Lotes: ${error.message}`);
  }

  return data;
};

export const obtenerLotePorIDService = async (number: number) => {
  const { data, error } = await supabase
    .from('lotes_cosecha')
    .select(`
      *
    `)
    .eq("id_lote", number);

  if (error) {
    throw new Error(`Error al obtener Lotes: ${error.message}`);
  }

  return data;
};

export const getSeccionCultivoPorIDService = async (number: number) => {
  const { data, error } = await supabase
    .from('secciones_cultivo')
    .select(`
      *
    `)
    .eq("id_seccion", number);

  if (error) {
    throw new Error(`Error al obtener Lotes: ${error.message}`);
  }

  return data;
};
