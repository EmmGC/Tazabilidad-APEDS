// @ts-nocheck
import "@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js@2.39.0"
import { z } from "npm:zod@3.22.4"
import { GoogleGenerativeAI } from "npm:@google/generative-ai@0.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Inicializar clientes
const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
const supabase = createClient(supabaseUrl, supabaseKey)

const genAI = new GoogleGenerativeAI(Deno.env.get('GEMINI_API_KEY') || '')
const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN') || ''

// Función auxiliar para enviar mensajes a Telegram
async function sendTelegramMessage(chatId: number, text: string) {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  })
}

// Esquemas Zod por tabla
const schemas = {
  'Recepcion_Insumos': z.object({
    nombre_proveedor: z.string().optional(),
    nombre_insumo: z.string().optional(),
    cantidad: z.number().nullable().optional(),
    lote_insumo: z.string().optional(),
    fecha_caducidad: z.string().optional(), // YYYY-MM-DD
    numero_factura: z.string().optional()
  }),
  'Lotes_Cosecha': z.object({
    cantidad_cajas: z.number().optional(),
    peso_kg: z.number().optional(),
    uso_cultivo: z.string().optional(),
    calidad: z.string().optional(),
    calibre: z.string().optional(),
    color: z.string().optional(),
    observaciones_calidad: z.string().optional()
  }),
  'Bitacora_Actividades': z.object({
    tipo_actividad: z.string().optional(),
    equipo_aplicacion: z.string().optional(),
    lavado: z.boolean().optional(),
    desinfeccion: z.boolean().optional(),
    observaciones: z.string().optional()
  }),
  'Detalle_Aplicacion_Insumos': z.object({
    dosis_aplicada: z.number().optional(),
    unidad_dosis: z.string().optional(),
    nombre_insumo: z.string().optional()
  }),
  'Historial_Transporte_Lotes': z.object({
    placas_transporte: z.string().optional(),
    nombre_cliente: z.string().optional(),
    cajas_transportadas: z.number().optional(),
    peso_transportado_kg: z.number().optional(),
    temperatura_salida: z.number().optional(),
    temperatura_llegada: z.number().optional(),
    documento_entrega: z.string().optional(),
    incidencias: z.string().optional(),
    entregado_completo: z.boolean().optional(),
    vehiculo_lavado_desinfectado: z.boolean().optional()
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  let update: any = {}
  try {
    update = await req.json()
    const message = update.message

    if (!message || !message.text || !message.from) {
      return new Response('OK', { status: 200 })
    }

    const telegramId = message.from.id
    const text = message.text

    // 1. Validar usuario en perfiles_bot
    const { data: perfil, error: perfilError } = await supabase
      .from('perfiles_bot')
      .select('*')
      .eq('telegram_id', telegramId)
      .single()

    if (perfilError || !perfil) {
      await sendTelegramMessage(telegramId, '❌ No estás autorizado para usar este bot o no tienes un perfil asignado.')
      return new Response('Unauthorized', { status: 200 })
    }
    const tablaAsignada = perfil.tabla_asignada

    let camposRequeridos = ''
    if (tablaAsignada === 'Recepcion_Insumos') camposRequeridos = "Proveedor del producto\nInsumo recibido\nCantidad (L, Kg, etc.)\nLote (opcional)\nFecha de Caducidad (opcional)\nNúmero de Factura (opcional)"
    else if (tablaAsignada === 'Lotes_Cosecha') camposRequeridos = "Sección de cultivo\nFecha de cosecha\nAño\nCantidad de Cajas\nPeso Total\nUso de cultivo (ej. consumo nacional)\nCalidad\nCalibre\nColor\nObservaciones"
    else if (tablaAsignada === 'Bitacora_Actividades') camposRequeridos = "Sección de cultivo\nTipo de actividad\nEquipo de aplicación\nLavado (sí/no)\nDesinfección (sí/no)\nObservaciones"
    else if (tablaAsignada === 'Detalle_Aplicacion_Insumos') camposRequeridos = "Nombre del insumo comercial\nDosis\nUnidad (ej. Litros)"
    else if (tablaAsignada === 'Historial_Transporte_Lotes') camposRequeridos = "Placas\nCliente Destino\nCajas Transportadas\nPeso Transportado (kg)\nTemp. Inicial\nTemp. de Llegada\nNo. de Documento\nIncidencias\nEntregado Completo (sí/no)\nVehículo Limpio (sí/no)"

    const msjBienvenida = `🔹 Perfil activo: *${tablaAsignada}*\n\n📝 Para iniciar un registro en esta bitácora, descríbeme tu actividad o manda los datos (te preguntaré lo que falte). Suelo requerir esto:\n\n${camposRequeridos}\n\nEnvía *cancelar* o *reiniciar* en cualquier momento para borrar mi memoria y empezar de nuevo.`

    // Interceptar saludos o reinicios para limpiar memoria y enviar instrucciones:
    if (['/start', 'hola', 'ayuda', 'reiniciar', 'cancelar'].includes(text.trim().toLowerCase())) {
      await supabase.from('historial_chat_bot').delete().eq('telegram_id', telegramId)
      await sendTelegramMessage(telegramId, msjBienvenida)
      return new Response('Reset/Welcome', { status: 200 })
    }

    // 2. Extraer historial del chat
    let historial = []
    const { data: historialData } = await supabase
      .from('historial_chat_bot')
      .select('historial')
      .eq('telegram_id', telegramId)
      .single()

    if (historialData && historialData.historial) {
      historial = historialData.historial
    }

    // 3. Preparar Prompts y Esquemas
    let extractSchemaStr = ''
    if (tablaAsignada === 'Recepcion_Insumos') {
      extractSchemaStr = `{"nombre_proveedor": "string", "nombre_insumo": "string", "cantidad": "numero", "lote_insumo": "string", "fecha_caducidad": "YYYY-MM-DD", "numero_factura": "string"}`
    } else if (tablaAsignada === 'Lotes_Cosecha') {
      extractSchemaStr = `{"seccion_cultivo": "string", "fecha_cosecha": "YYYY-MM-DD", "anio_cosecha": "numero integer", "cantidad_cajas": "numero integer", "peso_kg": "numero decimal", "uso_cultivo": "string", "calidad": "string", "calibre": "string", "color": "string", "observaciones_calidad": "string"}`
    } else if (tablaAsignada === 'Bitacora_Actividades') {
      // Nota: id_seccion debe pedirse si es requerido, aquí asumimos seccion_cultivo
      extractSchemaStr = `{"seccion_cultivo": "string", "tipo_actividad": "string", "equipo_aplicacion": "string", "lavado": "boolean", "desinfeccion": "boolean", "observaciones": "string"}`
    } else if (tablaAsignada === 'Detalle_Aplicacion_Insumos') {
      extractSchemaStr = `{"dosis_aplicada": "numero", "unidad_dosis": "string (ej. litros)", "nombre_insumo": "string"}`
    } else if (tablaAsignada === 'Historial_Transporte_Lotes') {
      extractSchemaStr = `{"placas_transporte": "string", "nombre_cliente": "string", "cajas_transportadas": "numero", "peso_transportado_kg": "numero", "temperatura_salida": "numero", "temperatura_llegada": "numero", "documento_entrega": "string", "incidencias": "string", "entregado_completo": "boolean", "vehiculo_lavado_desinfectado": "boolean"}`
    } else {
      await sendTelegramMessage(telegramId, `❌ Aún no he sido configurado para procesar datos de la tabla: ${tablaAsignada}.`)
      return new Response('Not Implemented', { status: 200 })
    }

    const systemInstruction = `
      Eres un asistente experto en trazabilidad agrícola conversando por Telegram.
      Tu meta es recolectar datos para registrar un evento en la tabla: ${tablaAsignada}.
      
      Los campos que NECESITAS recolectar en total son (y sus tipos esperados): 
      ${extractSchemaStr}

      REGLAS ESTRICTAS PARA TU RESPUESTA (SIEMPRE debes devolver un JSON con esta estructura exacta, NO markdown, NO texto libre):
      {
        "mensaje_para_telegram": "Lo que le quieres decir o preguntar al usuario de forma amigable.",
        "accion_interna": "PREGUNTAR | CONFIRMAR | INSERTAR",
        "datos_recolectados": { ...aquí vas acumulando todos los datos que ya te dio el usuario, mapeados al esquema anterior... }
      }

      CÓMO ACTUAR:
      1. Si faltan datos importantes obligatorios de la lista (ej. cantidad, proveedor, insumo), tu "accion_interna" es "PREGUNTAR" y tu "mensaje_para_telegram" debe pedir amablemente los datos faltantes.
      2. Si ya tienes TODOS los datos necesarios pero el usuario aún no te ha confirmado que están correctos, tu "accion_interna" es "CONFIRMAR". En tu "mensaje_para_telegram" debes mostrar una lista o resumen muy claro de lo que juntaste y preguntarle explicítamente al usuario "¿Está correcto? ¿Puedo proceder a guardarlo?".
      3. Si el usuario te acaba de responder afirmativamente (sí, ok, dale, correcto) a tu pregunta de confirmación anterior, entonces y SOLO ENTONCES tu "accion_interna" será "INSERTAR". Tu "mensaje_para_telegram" puede ser "Procesando registro...".
      
      IMPORTANTE: Sigue la conversación natural. Acumula los datos en "datos_recolectados" a lo largo de los mensajes.
    `

    console.log('Iniciando chat con Gemini...')
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash', 
      systemInstruction,
      generationConfig: { responseMimeType: "application/json" } 
    })

    const chat = model.startChat({ history: historial })
    let responseText = ""
    try {
      const result = await chat.sendMessage(text)
      responseText = result.response.text()
      console.log('Respuesta de Gemini recibida:', responseText)
    } catch (apiError) {
      console.error("Error al comunicarse con Gemini:", apiError)
      await sendTelegramMessage(telegramId, "❌ Ocurrió un error al contactar a la inteligencia artificial. Intenta más tarde.")
      return new Response('Error API Gemini', { status: 200 })
    }

    let geminiResponse;
    try {
      geminiResponse = JSON.parse(responseText)
    } catch (e) {
      await sendTelegramMessage(telegramId, '❌ Hubo un error procesando el JSON conversacional. Por favor, intenta de nuevo o escribe "reiniciar".')
      return new Response('Parse error', { status: 200 })
    }

    const { mensaje_para_telegram, accion_interna, datos_recolectados } = geminiResponse

    // 4. Enviar respuesta conversacional al humano
    if (mensaje_para_telegram && accion_interna !== "INSERTAR") {
      await sendTelegramMessage(telegramId, mensaje_para_telegram)
    }

    // 5. Mantenimiento del Historial
    if (accion_interna !== "INSERTAR") {
      // Guardar nuevo historial
      const newHistory = await chat.getHistory()
      // upsert en historial_chat_bot
      await supabase.from('historial_chat_bot').upsert({
        telegram_id: telegramId,
        historial: newHistory
      }, { onConflict: 'telegram_id' })
      return new Response('Pregunta enviada', { status: 200 })
    }

    // 6. FLUJO DE INSERCIÓN (Cuando accion_interna === "INSERTAR")
    await sendTelegramMessage(telegramId, "⚙️ Procediendo a guardar datos definitivos en la base de datos...")
    const parsedData = datos_recolectados || {}

    // Búsqueda de foráneas e inserción
    if (tablaAsignada === 'Recepcion_Insumos') {
      let id_proveedor = null
      let id_insumo = null

      if (parsedData.nombre_proveedor) {
        const { data: provs } = await supabase.from('proveedores').select('id_proveedor').ilike('nombre_empresa', `%${parsedData.nombre_proveedor}%`).limit(1)
        if (provs && provs.length > 0) id_proveedor = provs[0].id_proveedor
      }

      if (parsedData.nombre_insumo) {
        const { data: insumos } = await supabase.from('insumos_agricolas').select('id_insumo').ilike('nombre_comercial', `%${parsedData.nombre_insumo}%`).limit(1)
        if (insumos && insumos.length > 0) id_insumo = insumos[0].id_insumo
      }

      const insertPayload = {
        id_proveedor,
        id_insumo_agricola: id_insumo,
        cantidad: parsedData.cantidad,
        lote_insumo: parsedData.lote_insumo,
        fecha_caducidad: parsedData.fecha_caducidad,
        numero_factura: parsedData.numero_factura,
        responsable_recepcion: perfil.nombre
      }

      const { error: insertError } = await supabase.from('recepcion_insumos').insert([insertPayload])

      if (insertError) {
        console.error('Insert error:', insertError)
        await sendTelegramMessage(telegramId, '❌ Hubo un error al guardar en la base de datos de Recepción.')
      } else {
        await sendTelegramMessage(telegramId, `✅ ¡Recepción guardada exitosamente!\n\nIDs encontrados:\nProveedor: ${id_proveedor || 'No encontrado'}\nInsumo: ${id_insumo || 'No encontrado'}`)
        await supabase.from('historial_chat_bot').delete().eq('telegram_id', telegramId) // Limpiamos caché
      }

    } else if (tablaAsignada === 'Bitacora_Actividades') {
      let id_seccion = null
      if (parsedData.seccion_cultivo) {
        const { data: seccs } = await supabase.from('secciones_cultivo').select('id_seccion').ilike('nombre_seccion', `%${parsedData.seccion_cultivo}%`).limit(1)
        if (seccs && seccs.length > 0) id_seccion = seccs[0].id_seccion
      }

      const insertPayload = {
        id_seccion,
        tipo_actividad: parsedData.tipo_actividad,
        equipo_aplicacion: parsedData.equipo_aplicacion,
        lavado: parsedData.lavado,
        desinfeccion: parsedData.desinfeccion,
        observaciones: parsedData.observaciones,
        responsable_aplicacion: perfil.nombre
      }
      const { error: insertError } = await supabase.from('bitacora_actividades').insert([insertPayload])
      if (insertError) {
        await sendTelegramMessage(telegramId, '❌ Hubo un error al guardar la bitácora.')
      } else {
        await sendTelegramMessage(telegramId, `✅ ¡Actividad de campo guardada exitosamente!\nSección BD: ${id_seccion || 'No resuelto'}`)
        await supabase.from('historial_chat_bot').delete().eq('telegram_id', telegramId)
      }

    } else if (tablaAsignada === 'Detalle_Aplicacion_Insumos') {
      let id_insumo = null
      if (parsedData.nombre_insumo) {
        const { data: insumos } = await supabase.from('insumos_agricolas').select('id_insumo').ilike('nombre_comercial', `%${parsedData.nombre_insumo}%`).limit(1)
        if (insumos && insumos.length > 0) id_insumo = insumos[0].id_insumo
      }
      const insertPayload = {
        id_insumo,
        dosis_aplicada: parsedData.dosis_aplicada,
        unidad_dosis: parsedData.unidad_dosis,
        responsable_mezcla: perfil.nombre
      }
      const { error: insertError } = await supabase.from('detalle_aplicacion_insumos').insert([insertPayload])
      if (insertError) {
        await sendTelegramMessage(telegramId, '❌ Hubo un error al guardar la aplicación.')
      } else {
        await sendTelegramMessage(telegramId, `✅ ¡Aplicación de insumo guardada exitosamente!\nInsumo BD: ${id_insumo || 'No encontrado'}`)
        await supabase.from('historial_chat_bot').delete().eq('telegram_id', telegramId)
      }

    } else if (tablaAsignada === 'Lotes_Cosecha') {
      let id_seccion = null
      if (parsedData.seccion_cultivo) {
        const { data: seccs } = await supabase.from('secciones_cultivo').select('id_seccion').ilike('nombre_seccion', `%${parsedData.seccion_cultivo}%`).limit(1)
        if (seccs && seccs.length > 0) id_seccion = seccs[0].id_seccion
      }

      const insertPayload = {
        id_seccion,
        fecha_cosecha: parsedData.fecha_cosecha || new Date().toISOString(),
        anio_cosecha: parsedData.anio_cosecha,
        cantidad_cajas: parsedData.cantidad_cajas,
        peso_kg: parsedData.peso_kg,
        uso_cultivo: parsedData.uso_cultivo,
        calidad: parsedData.calidad,
        calibre: parsedData.calibre,
        color: parsedData.color,
        observaciones_calidad: parsedData.observaciones_calidad,
      }

      const { error: insertError } = await supabase.from('lotes_cosecha').insert([insertPayload])
      if (insertError) {
        console.error('Insert error Lotes_Cosecha:', insertError)
        await sendTelegramMessage(telegramId, '❌ Hubo un error al guardar en Lotes_Cosecha.')
      } else {
        await sendTelegramMessage(telegramId, `✅ ¡Lote de cosecha guardado exitosamente!\nSección BD: ${id_seccion || 'No resuelto'}`)
        await supabase.from('historial_chat_bot').delete().eq('telegram_id', telegramId)
      }

    } else if (tablaAsignada === 'Historial_Transporte_Lotes') {
      let id_transporte = null
      let id_cliente = null
      
      if (parsedData.placas_transporte) {
        const { data: transportes } = await supabase.from('transportes').select('id_transporte').ilike('placas', `%${parsedData.placas_transporte}%`).limit(1)
        if (transportes && transportes.length > 0) id_transporte = transportes[0].id_transporte
      }
      
      if (parsedData.nombre_cliente) {
        const { data: clientes } = await supabase.from('clientes_destinos').select('id_cliente').ilike('nombre_empresa', `%${parsedData.nombre_cliente}%`).limit(1)
        if (clientes && clientes.length > 0) id_cliente = clientes[0].id_cliente
      }

      const insertPayload = {
        id_transporte,
        id_cliente,
        cajas_transportadas: parsedData.cajas_transportadas,
        peso_transportado_kg: parsedData.peso_transportado_kg,
        temperatura_salida: parsedData.temperatura_salida,
        temperatura_llegada: parsedData.temperatura_llegada,
        documento_entrega: parsedData.documento_entrega,
        incidencias: parsedData.incidencias,
        entregado_completo: parsedData.entregado_completo,
        vehiculo_lavado_desinfectado: parsedData.vehiculo_lavado_desinfectado,
        responsable_carga: perfil.nombre
      }
      const { error: insertError } = await supabase.from('historial_transporte_lotes').insert([insertPayload])
      if (insertError) {
        await sendTelegramMessage(telegramId, '❌ Hubo un error al guardar el historial de transporte.')
      } else {
        await sendTelegramMessage(telegramId, `✅ ¡Transporte registrado exitosamente!\nTransporte BD: ${id_transporte || 'No encontrado'}\nCliente BD: ${id_cliente || 'No encontrado'}`)
        await supabase.from('historial_chat_bot').delete().eq('telegram_id', telegramId)
      }
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error('Unexpected error:', error)
    const chatId = update?.message?.from?.id
    if (chatId) {
      await sendTelegramMessage(chatId, `❌ Error en el servidor: ${error.message || 'Error desconocido'}`)
    }
    return new Response('Unexpected error', { status: 200 })
  }
})
