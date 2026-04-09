import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSGRESQL_URI, 
});

export const getRelatedIDs = async (number: number, idType: string) => {
  const allowedColumns = ['id_cliente', 'id_transporte', 'id_lote', 'id_seccion'];
  if (!allowedColumns.includes(idType)) throw new Error(`idType no soportado: ${idType}`);

  // Table each ID belongs to
  const tableMap: Record<string, string> = {
    id_cliente:    'cd',
    id_transporte: 'htl',
    id_lote:       'lc',
    id_seccion:    'sc',
  };

  const query = `
    SELECT cd.id_cliente, htl.id_transporte, lc.id_lote, sc.id_seccion,
           up.id_unidad, ba.id_actividad, dai.id_insumo
    FROM clientes_destinos cd
    JOIN historial_transporte_lotes htl USING(id_cliente)
    JOIN lotes_cosecha lc              USING(id_lote)
    JOIN transportes t                 USING(id_transporte)
    JOIN secciones_cultivo sc          USING(id_seccion)
    JOIN unidades_produccion up        USING(id_unidad)
    JOIN bitacora_actividades ba       USING(id_seccion)
    JOIN detalle_aplicacion_insumos dai USING(id_actividad)
    WHERE ${tableMap[idType]}.${idType} = $1
  `;

  const { rows, } = await pool.query(query, [number]);
  return rows;
};