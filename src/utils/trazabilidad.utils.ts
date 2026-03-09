import { format } from 'date-fns';

/**
 * Calcula el día del año (001 a 366)
 */
export const getJulianDay = (date: Date): string => 
{
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day.toString().padStart(3, '0');
};

/**
 * Genera el código oficial basado en tu estructura SQL
 */
export const formatTraceabilityCode = (params: 
{
  estado: string;   // 2 dígitos
  muni: string;     // 3 dígitos
  up: string;       // 2 dígitos
  cultivo: string;  // 2 dígitos
  variedad: string; // 2 dígitos
  seccion: string;  // 2 dígitos
  fecha: Date;
}) => 
{
  const julian = getJulianDay(params.fecha);
  const year = format(params.fecha, 'yy'); // Últimos 2 dígitos del año

  // Estructura: 750 + ESTADO + MUNI + UP + CULT + VAR + SECC + JULIAN + AÑO
  return `750${params.estado}${params.muni}${params.up}${params.cultivo}${params.variedad}${params.seccion}${julian}${year}`;
};