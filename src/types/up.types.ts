export interface UnidadProduccionData {
  nombre_unidad: string;
  pais?: string;
  estado: string;
  municipio: string;
  codigo_postal: string;
  direccion_predio: string;
  latitud?: number;
  longitud?: number;
  certificaciones?: string;
  codigo_estado: string;
  codigo_municipio: string;
  numero_up: string;
}

export interface SeccionCultivoData {
  id_unidad: number;
  nombre_seccion: string;
  cultivo: string;
  variedad: string;
  superficie_hectareas: number;
  fecha_siembra?: string;
  fecha_estimada_cosecha?: string;
  codigo_seccion: string;
  codigo_cultivo: string;
  codigo_variedad: string;
}
