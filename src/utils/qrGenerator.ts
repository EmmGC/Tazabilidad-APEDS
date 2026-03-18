import QRCode from 'qrcode';

export const generarQrMimetizado = async (codigoTrazabilidad: string): Promise<string> => {
  try {
    // La URL aquí sería un enlace público a un frontend que parsea el código,
    // por ejemplo: https://traceability-app.com/public?code=750...
    const urlPublica = `https://misistemaagricola.com/trazabilidad?codigo=${codigoTrazabilidad}`;
    
    // Genera el QR y lo devuelve como Data URI en base64 (image/png)
    const base64Image = await QRCode.toDataURL(urlPublica);
    return base64Image;
  } catch (err) {
    throw new Error('Error al generar el Código QR');
  }
};
