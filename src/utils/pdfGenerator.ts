import PDFDocument from 'pdfkit';

export const generarPdfAuditoria = (datosRastreo: any): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers: Buffer[] = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });

      // Encabezado
      doc.fontSize(20).text('Reporte de Auditoría y Trazabilidad', { align: 'center' });
      doc.moveDown();

      // Información del Lote
      doc.fontSize(14).text('1. Información del Lote');
      doc.fontSize(12).text(`Código Trazabilidad: ${datosRastreo.lote.codigo_trazabilidad}`);
      doc.text(`Fecha Cosecha: ${datosRastreo.lote.fecha_cosecha}`);
      doc.text(`Cantidad: ${datosRastreo.lote.cantidad_cajas} cajas (${datosRastreo.lote.peso_kg} kg)`);
      doc.moveDown();

      // Origen
      const seccion = datosRastreo.lote.secciones_cultivo;
      doc.fontSize(14).text('2. Origen del Producto');
      doc.fontSize(12).text(`Unidad de Producción: ${seccion.unidades_produccion.nombre_unidad}`);
      doc.text(`Sección: ${seccion.nombre_seccion}`);
      doc.text(`Cultivo: ${seccion.cultivo} (${seccion.variedad})`);
      doc.moveDown();

      // Insumos Aplicados (Hacia Atrás)
      doc.fontSize(14).text('3. Insumos Aplicados (Trazabilidad Hacia Atrás)');
      if (datosRastreo.actividadesPrevias.length === 0) {
        doc.fontSize(12).text('No se registraron aplicaciones de insumos.');
      } else {
        datosRastreo.actividadesPrevias.forEach((act: any) => {
          doc.fontSize(12).text(`Fecha Actividad: ${act.fecha} - ${act.tipo_actividad}`);
          act.detalle_aplicacion_insumos.forEach((det: any) => {
            const insumo = det.insumos_agricolas;
            doc.text(` - ${insumo.nombre_comercial} (Reg: ${insumo.registro_cofepris}) | Dosis: ${det.dosis_aplicada} ${det.unidad_dosis}`);
          });
        });
      }
      doc.moveDown();

      // Destino (Hacia Adelante)
      doc.fontSize(14).text('4. Envíos y Clientes Destino (Trazabilidad Hacia Adelante)');
      if (datosRastreo.enviosDestino.length === 0) {
        doc.fontSize(12).text('Este lote aún no ha sido despachado en ningún envío.');
      } else {
        datosRastreo.enviosDestino.forEach((envio: any) => {
          doc.fontSize(12).text(`Fecha Salida: ${envio.fecha_salida}`);
          doc.text(`Cliente: ${envio.clientes_destinos.nombre_empresa}`);
          doc.text(`Placas Transporte: ${envio.transportes.placas}`);
        });
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};
