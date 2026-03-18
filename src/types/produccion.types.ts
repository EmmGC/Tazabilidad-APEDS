export interface BitacoraActividadData {
  id_seccion: number;
  fecha?: string;
  tipo_actividad: string; // Ej. 'Lavado', 'Desinfección', 'Aplicación Insumos'
  equipo_aplicacion?: string;
  lavado?: boolean;
  desinfeccion?: boolean;
  responsable_aplicacion?: string; // Llenado por trigger
  observaciones?: string;
}

export interface DetalleAplicacionInsumoData {
  id_actividad: number;
  id_insumo: number;
  dosis_aplicada: number;
  unidad_dosis: string;
  responsable_mezcla?: string; // Llenado por trigger
}

export interface LoteCosechaData {
  id_seccion: number;
  fecha_cosecha?: string;
  fecha_juliana?: number;
  anio_cosecha?: number;
  cantidad_cajas: number;
  peso_kg: number;
  uso_cultivo?: string;
  calidad?: string;
  calibre?: string;
  color?: string;
  observaciones_calidad?: string;
  codigo_trazabilidad?: string; 
}
