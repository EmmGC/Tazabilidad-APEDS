import request from 'supertest';
import app from '../server';
import { supabase } from '../src/config/supabaseClient';

describe('Módulo Identidad: UPs y Secciones (Integración)', () => {

  beforeAll(async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email: 'prubas@gmail.com',
      password: '123456789'
    });
    if (error) {
      console.warn("Fallo el login de prueba:", error.message);
    }
  });

  it('POST /api/up/unidades - Debería crear una Unidad de Producción (UP) exitosamente', async () => {
    const payload = {
      nombre_unidad: "Finca El Sol",
      estado: "Puebla",
      municipio: "Atlixco",
      codigo_postal: "74200",
      direccion_predio: "Carretera 1 Sur",
      codigo_estado: "21",
      codigo_municipio: "114",
      numero_up: "01"
    };

    const res = await request(app)
      .post('/api/up/unidades')
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('mensaje');
    expect(res.body.mensaje).toBe("Unidad de Producción registrada correctamente.");
    expect(res.body.data).toHaveProperty('id_unidad');
  });

  it('POST /api/up/unidades - Debería retornar error 400 si faltan datos obligatorios', async () => {
    // Faltan códigos geográficos vitales según el requerimiento REQ-DOC-01
    const missingDataPayload = {
      nombre_unidad: "Finca Incompleta"
    };

    const res = await request(app)
      .post('/api/up/unidades')
      .send(missingDataPayload);

    expect(res.status).toBe(400);
    expect(res.body.error).toContain("Faltan datos obligatorios para crear la Unidad de Producción");
  });
});
