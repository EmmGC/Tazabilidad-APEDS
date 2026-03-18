import request from 'supertest';
import app from '../server';
import { supabase } from '../src/config/supabaseClient';

describe('Módulo Producción: Lotes y Algoritmo TraceCode (Integración)', () => {
  let idSeccionCreada: number;

  beforeAll(async () => {
    // 0. Autenticarnos para pasar el RLS
    const { error } = await supabase.auth.signInWithPassword({
      email: 'prubas@gmail.com',
      password: '123456789'
    });
    if (error) {
      console.warn("Fallo el login de prueba en producción:", error.message);
    }
    // 1. Crear una UP temporal para probar
    const resUP = await request(app).post('/api/up/unidades').send({
      nombre_unidad: "UP Test Integración",
      estado: "Jalisco",
      municipio: "Tequila",
      codigo_postal: "46400",
      direccion_predio: "Conocido",
      codigo_estado: "14",
      codigo_municipio: "094",
      numero_up: "99"
    });
    const idUnidad = resUP.body.data.id_unidad;

    // 2. Crear una Sección que pertenezca a la UP anterior
    const resSeccion = await request(app).post('/api/up/secciones').send({
      id_unidad: idUnidad,
      nombre_seccion: "Sección Test Lote",
      cultivo: "Agave",
      variedad: "Azul",
      superficie_hectareas: 10,
      codigo_seccion: "01",
      codigo_cultivo: "05",
      codigo_variedad: "01"
    });
    idSeccionCreada = resSeccion.body.data.id_seccion;
  });

  it('POST /api/produccion/lotes - Debe generar el Lote de Cosecha EN LA BD con su código', async () => {
    // REQ-DOC-08: El controlador inserta en Lotes_Cosecha y usa Vista_Codigo_Trazabilidad
    const payloadLote = {
      id_seccion: idSeccionCreada,
      fecha_cosecha: "2023-11-01",
      cantidad_cajas: 10,
      peso_kg: 200,
      calidad: "Premium"
    };

    const res = await request(app)
      .post('/api/produccion/lotes')
      .send(payloadLote);

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('codigo_trazabilidad');
    
    // Validar que el código empiece con 750 (País) y los códigos de UP (14, 094, 99)
    expect(res.body.data.codigo_trazabilidad).toContain('7501409499'); 
    expect(res.body.data.cantidad_cajas).toBe(10);
  });

  it('POST /api/produccion/lotes - Debe rechazar faltantes obligatorios', async () => {
    const incompletePayload = {
      id_seccion: idSeccionCreada
      // Faltan cajas y peso_kg
    };

    const res = await request(app)
      .post('/api/produccion/lotes')
      .send(incompletePayload);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Faltan datos obligatorios para el lote de cosecha");
  });

});
