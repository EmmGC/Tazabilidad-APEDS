export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database 
{
    public: 
    {
        Tables:
        {
            // --- IDENTIDAD Y ROLES ---
            Perfiles_Usuarios: {
                Row: { id: string; nombre: string | null;  rol: 'Administrador' | 'Recepcion' | 'Produccion' | 'Embarques' | 'Transporte' | 'Auditor' | null }
                Insert: { id: string; nombre?: string | null; rol?: 'Administrador' | 'Recepcion' | 'Produccion' | 'Embarques' | 'Transporte' | 'Auditor' | null }
            }
            // --- CATÁLOGOS E INSUMOS ---
            Proveedores: {
                Row: { id_proveedor: number; nombre_empresa: string; contacto_ventas: string | null; correo_contacto: string | null; direccion: string | null; telefono: string | null }
                Insert: { id_proveedor?: number; nombre_empresa: string; contacto_ventas?: string | null; correo_contacto?: string | null; direccion?: string | null; telefono?: string | null }
            }
            Insumos_Agricolas: {
                Row: { id_insumo: number; nombre_comercial: string; ingrediente_activo: string | null; formulacion: string | null; presentacion: string | null; registro_cofepris: string | null }
                Insert: { id_insumo?: number; nombre_comercial: string; ingrediente_activo?: string | null; formulacion?: string | null; presentacion?: string | null; registro_cofepris?: string | null }
            }
            Recepcion_Insumos: {
                Row: { id_recepcion: number; id_proveedor: number | null; id_insumo_agricola: number | null; fecha_recepcion: string | null; cantidad: number | null; lote_insumo: string | null; fecha_caducidad: string | null; numero_factura: string | null; responsable_recepcion: string | null }
                Insert: { id_recepcion?: number; id_proveedor?: number | null; id_insumo_agricola?: number | null; fecha_recepcion?: string | null; cantidad?: number | null; lote_insumo?: string | null; fecha_caducidad?: string | null; numero_factura?: string | null; responsable_recepcion?: string | null }
            }

            // --- ESTRUCTURA DE PRODUCCIÓN ---
            Unidades_Produccion: {
                Row: { id_unidad: number; nombre_unidad: string; pais: string; estado: string | null; municipio: string | null; codigo_postal: string | null; direccion_predio: string | null; latitud: number | null; longitud: number | null; certificaciones: string | null; codigo_estado: string | null; codigo_municipio: string | null; numero_up: string | null }
                Insert: { id_unidad?: number; nombre_unidad: string; pais?: string; estado?: string | null; municipio?: string | null; codigo_postal?: string | null; direccion_predio?: string | null; latitud?: number | null; longitud?: number | null; certificaciones?: string | null; codigo_estado?: string | null; codigo_municipio?: string | null; numero_up?: string | null }
            }
            Secciones_Cultivo: {
                Row: { id_seccion: number; id_unidad: number | null; nombre_seccion: string; cultivo: string | null; variedad: string | null; superficie_hectareas: number | null; fecha_siembra: string | null; fecha_estimada_cosecha: string | null; codigo_seccion: string | null; codigo_cultivo: string | null; codigo_variedad: string | null }
                Insert: { id_seccion?: number; id_unidad?: number | null; nombre_seccion: string; cultivo?: string | null; variedad?: string | null; superficie_hectareas?: number | null; fecha_siembra?: string | null; fecha_estimada_cosecha?: string | null; codigo_seccion?: string | null; codigo_cultivo?: string | null; codigo_variedad?: string | null }
            }

            // --- OPERACIÓN Y COSECHA ---
            Bitacora_Actividades: {
                Row: { id_actividad: number; id_seccion: number | null; fecha: string | null; tipo_actividad: string | null; equipo_aplicacion: string | null; lavado: boolean | null; desinfeccion: boolean | null; responsable_aplicacion: string | null; observaciones: string | null }
                Insert: { id_actividad?: number; id_seccion?: number | null; fecha?: string | null; tipo_actividad?: string | null; equipo_aplicacion?: string | null; lavado?: boolean | null; desinfeccion?: boolean | null; responsable_aplicacion?: string | null; observaciones?: string | null }
            }
            Detalle_Aplicacion_Insumos: {
                Row: { id_detalle: number; id_actividad: number | null; id_insumo: number | null; dosis_aplicada: number | null; unidad_dosis: string | null; responsable_mezcla: string | null }
                Insert: { id_detalle?: number; id_actividad?: number | null; id_insumo?: number | null; dosis_aplicada?: number | null; unidad_dosis?: string | null; responsable_mezcla?: string | null }
            }
            Lotes_Cosecha: {
                Row: { id_lote: number; id_seccion: number | null; fecha_cosecha: string | null; fecha_juliana: number | null; anio_cosecha: number | null; cantidad_cajas: number | null; peso_kg: number | null; uso_cultivo: string | null; calidad: string | null; calibre: string | null; color: string | null; observaciones_calidad: string | null; codigo_trazabilidad: string | null }
                Insert: { id_lote?: number; id_seccion?: number | null; fecha_cosecha?: string | null; fecha_juliana?: number | null; anio_cosecha?: number | null; cantidad_cajas?: number | null; peso_kg?: number | null; uso_cultivo?: string | null; calidad?: string | null; calibre?: string | null; color?: string | null; observaciones_calidad?: string | null; codigo_trazabilidad?: string | null }
            }

            // --- LOGÍSTICA ---
            Clientes_Destinos: {
                Row: { id_cliente: number; nombre_empresa: string; representante_legal: string | null; pais: string | null; estado: string | null; municipio: string | null; direccion: string | null; telefono: string | null; correo_electronico: string | null; marca_comercial: string | null; mercado_destino: string | null }
                Insert: { id_cliente?: number; nombre_empresa: string; representante_legal?: string | null; pais?: string | null; estado?: string | null; municipio?: string | null; direccion?: string | null; telefono?: string | null; correo_electronico?: string | null; marca_comercial?: string | null; mercado_destino?: string | null }
            }
            Transportes: {
                Row: { id_transporte: number; tipo_vehiculo: string | null; placas: string | null; capacidad_kg: number | null; capacidad_cajas: number | null; temperatura_min: number | null; temperatura_max: number | null; propietario: string | null; certificado_sanitario: boolean | null; ultima_revision: string | null; responsable_asignado: string | null; aseguranza: string | null }
                Insert: { id_transporte?: number; tipo_vehiculo?: string | null; placas?: string | null; capacidad_kg?: number | null; capacidad_cajas?: number | null; temperatura_min?: number | null; temperatura_max?: number | null; propietario?: string | null; certificado_sanitario?: boolean | null; ultima_revision?: string | null; responsable_asignado?: string | null; aseguranza?: string | null }
            }
            Historial_Transporte_Lotes: {
                Row: { id_historial: number; id_transporte: number | null; id_lote: number | null; id_cliente: number | null; fecha_salida: string | null; fecha_llegada: string | null; cajas_transportadas: number | null; peso_transportado_kg: number | null; temperatura_salida: number | null; temperatura_llegada: number | null; responsable_carga: string | null; responsable_entrega: string | null; documento_entrega: string | null; incidencias: string | null; entregado_completo: boolean | null; firma_digital: string | null; vehiculo_lavado_desinfectado: boolean | null }
                Insert: { id_historial?: number; id_transporte?: number | null; id_lote?: number | null; id_cliente?: number | null; fecha_salida?: string | null; fecha_llegada?: string | null; cajas_transportadas?: number | null; peso_transportado_kg?: number | null; temperatura_salida?: number | null; temperatura_llegada?: number | null; responsable_carga?: string | null; responsable_entrega?: string | null; documento_entrega?: string | null; incidencias?: string | null; entregado_completo?: boolean | null; firma_digital?: string | null; vehiculo_lavado_desinfectado?: boolean | null }
            }
        }
        Views: 
        {
            Vista_Codigo_Trazabilidad: 
            {
            Row: { id_lote: number | null; fecha_cosecha: string | null; nombre_unidad: string | null; codigo_trazabilidad_oficial: string | null }
            }
        };
    };
};