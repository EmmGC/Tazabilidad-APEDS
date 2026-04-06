import { supabase } from '../config/supabaseClient';
import { 
  ClienteDestinoData, 
  TransporteData, 
  HistorialTransporteLoteData 
} from '../types/logistica.types';

// ==========================================
// 1. Clientes de Destino
// ==========================================
export const registrarClienteService = async (data: ClienteDestinoData) => {
  const { data: result, error } = await supabase
    .from('clientes_destinos')
    .insert([data])
    .select()
    .single();

  if (error) throw new Error(`Error al registrar Cliente: ${error.message}`);
  return result;
};

export const obtenerClientesService = async () => {
  const { data, error } = await supabase
    .from('clientes_destinos')
    .select('*')
    .order('nombre_empresa', { ascending: true });

  if (error) throw new Error(`Error al obtener Clientes: ${error.message}`);
  return data;
};

export const obtenerClientesPorIDService = async (numero: number) => {
  const { data, error } = await supabase
    .from('clientes_destinos')
    .select('*')
    .eq("id_cliente", numero)

  if (error) throw new Error(`Error al obtener Clientes: ${error.message}`);
  return data;
};



// ==========================================
// 2. Transportes
// ==========================================
export const registrarTransporteService = async (data: TransporteData) => {
  const { data: result, error } = await supabase
    .from('transportes')
    .insert([data])
    .select()
    .single();

  if (error) throw new Error(`Error al registrar Transporte: ${error.message}`);
  return result;
};

export const obtenerTransportesService = async () => {
  const { data, error } = await supabase
    .from('transportes')
    .select('*')
    .order('placas', { ascending: true });

  if (error) throw new Error(`Error al obtener Transportes: ${error.message}`);
  return data;
};

export const obtenerTransportePorIDService = async (number:number) => {
  const { data, error } = await supabase
    .from('transportes')
    .select('*')
    .eq("id_transporte", number)

  if (error) throw new Error(`Error al obtener Transportes: ${error.message}`);
  return data;
};

// ==========================================
// 3. Embarque / Historial Transporte Lotes
// ==========================================
export const registrarEmbarqueService = async (data: HistorialTransporteLoteData) => {
  // Verificamos de manera lógica si el vehículo fue lavado
  if (!data.vehiculo_lavado_desinfectado) {
    throw new Error('No se puede despachar la carga. El vehículo debe estar lavado y desinfectado (REQ-DOC-12).');
  }

  const { data: result, error } = await supabase
    .from('historial_transporte_lotes')
    .insert([data])
    .select()
    .single();

  if (error) throw new Error(`Error al registrar Embarque: ${error.message}`);
  return result;
};

export const actualizarLlegadaEmbarqueService = async (id_historial: number, dataActualizacion: Partial<HistorialTransporteLoteData>) => {
  const { data: result, error } = await supabase
    .from('historial_transporte_lotes')
    .update(dataActualizacion)
    .eq('id_historial', id_historial)
    .select()
    .single();

  if (error) throw new Error(`Error al registrar Llegada de Embarque: ${error.message}`);
  return result;
};

export const obtenerEmbarquesService = async () => {
  const { data, error } = await supabase
    .from('historial_transporte_lotes')
    .select(`
      *,
      transportes ( placas, tipo_vehiculo ),
      lotes_cosecha ( codigo_trazabilidad ),
      clientes_destinos ( nombre_empresa, mercado_destino )
    `)
    .order('fecha_salida', { ascending: false });

  if (error) throw new Error(`Error al obtener Embarques: ${error.message}`);
  return data;
};

export const obtenerEmbarquesPorIDService = async (number:number) => {
  const { data, error } = await supabase
  .from('historial_transporte_lotes')
  .select(`
    id_transporte,
    id_lote,
    cajas_transportadas,
    fecha_salida,
    fecha_llegada,
    peso_transportado_kg,
    temperatura_salida,
    temperatura_llegada,
    incidencias,
    entregado_completo,
    vehiculo_lavado_desinfectado
  `)
  .eq('id_cliente', number);

  if (error) throw new Error(`Error al obtener Embarques: ${error.message}`);
  return data;
};

export const obtenerLotesPorIDService = async (number:number) => {
  const { data, error } = await supabase
    .from('lotes_cosecha')
    .select(`*`)
    .eq("id_lote", number)

  if (error) throw new Error(`Error al obtener Embarques: ${error.message}`);
  return data;
};
