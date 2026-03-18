import { supabase } from '../config/supabaseClient';

export const obtenerRastreoBidireccionalService = async (codigoTrazabilidad: string) => {
  // 1. Encontrar el Lote
  const { data: lote, error: errorLote } = await supabase
    .from('lotes_cosecha')
    .select(`
      *,
      secciones_cultivo ( 
        id_unidad, nombre_seccion, cultivo, variedad,
        unidades_produccion ( nombre_unidad, latitud, longitud )
      )
    `)
    .eq('codigo_trazabilidad', codigoTrazabilidad)
    .single();

  if (errorLote || !lote) throw new Error(`Lote no encontrado o error: ${errorLote?.message}`);

  // 2. Encontrar transporte destino (Hacia Adelante)
  const { data: envios } = await supabase
    .from('historial_transporte_lotes')
    .select(`
      *,
      clientes_destinos ( nombre_empresa, direccion ),
      transportes ( placas, responsable_asignado )
    `)
    .eq('id_lote', lote.id_lote);

  // 3. Encontrar aplicaciones de insumos en la sección de este lote (Hacia Atrás)
  const id_seccion = lote.id_seccion;
  const { data: actividades } = await supabase
    .from('bitacora_actividades')
    .select(`
      *,
      detalle_aplicacion_insumos (
        dosis_aplicada, unidad_dosis,
        insumos_agricolas ( nombre_comercial, registro_cofepris )
      )
    `)
    .eq('id_seccion', id_seccion)
    .lte('fecha', lote.fecha_cosecha); // Insumos aplicados antes de la cosecha

  return {
    lote,
    enviosDestino: envios || [],
    actividadesPrevias: actividades || []
  };
};
