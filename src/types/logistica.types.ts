export interface ClienteDestinoData {
  nombre_empresa: string;
  representante_legal?: string;
  pais?: string;
  estado?: string;
  municipio?: string;
  direccion?: string;
  telefono?: string;
  correo_electronico?: string;
  marca_comercial?: string;
  mercado_destino?: string;
}

export interface TransporteData {
  tipo_vehiculo: string;
  placas: string;
  capacidad_kg?: number;
  capacidad_cajas?: number;
  temperatura_min?: number;
  temperatura_max?: number;
  propietario?: string;
  certificado_sanitario?: boolean;
  ultima_revision?: string;
  responsable_asignado?: string;
  aseguranza?: string;
}

export interface HistorialTransporteLoteData {
  id_transporte: number;
  id_lote: number;
  id_cliente: number;
  fecha_salida?: string;
  fecha_llegada?: string;
  cajas_transportadas: number;
  peso_transportado_kg: number;
  temperatura_salida?: number;
  temperatura_llegada?: number;
  responsable_carga?: string; // Por trigger
  responsable_entrega?: string; // Por trigger al hacer Update
  documento_entrega?: string;
  incidencias?: string;
  entregado_completo?: boolean;
  firma_digital?: string;
  vehiculo_lavado_desinfectado: boolean;
}
