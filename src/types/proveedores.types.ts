export interface ProveedorData {
  nombre_empresa: string;
  contacto_ventas?: string;
  correo_contacto?: string;
  direccion?: string;
  telefono?: string;
}

export interface RecepcionInsumoData {
  id_proveedor: number;
  id_insumo_agricola: number;
  fecha_recepcion?: string; // DEFAULT CURRENT_DATE en BD
  cantidad: number;
  lote_insumo: string;        // VITAL
  fecha_caducidad?: string;
  numero_factura?: string;
  responsable_recepcion?: string; // Llenado por el trigger
}
