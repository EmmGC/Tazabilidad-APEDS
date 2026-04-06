# Trazabilidad Agrícola - Ecosistema Completo (API Web + Bot IA Telegram)

Esta es la base de datos, API Backend y Orquestación del Sistema de Trazabilidad Agrícola, desarrollada utilizando **Node.js, Express, TypeScript, Supabase (Autenticación y BD) y Google Gemini 2.5 Flash** para recolección de datos mediante inteligencia artificial.

El sistema se compone de una **Arquitectura Híbrida**:
1. **Módulo Web Administrativo:** Catálogos estáticos como Proveedores, Insumos, Secciones de Cultivo y Clientes gestionados vía API (Express).
2. **Módulo Conversacional (Bot de Telegram):** Ingreso de datos operativos y de campo (Bitácoras, Lotes, Transportes) utilizando NLP y la IA de Google Gemini como asistente de recolección de datos, implementado sobre **Supabase Edge Functions**.

---

## 🚀 Arquitectura y Tablas

### 1. Sistema Conversacional (Bot)
El bot de Telegram está restringido únicamente a usuarios autorizados mediante la tabla `Perfiles_Bot`, quienes son mapeados y restringidos a una "Tabla Asignada" específica (`Recepcion_Insumos`, `Bitacora_Actividades`, `Lotes_Cosecha`, etc.).
- Funcionalidad de IA: Usa memoria conversacional (`Historial_Chat_Bot`) para hacer preguntas interactivas hasta recolectar todos los campos del esquema, posteriormente busca y reemplaza nombres (ej. provedores) por sus respectivas llaves foráneas.
- Interacción final a través de *Inline Keyboards* de Telegram para confirmación fácil y rápida.

### 2. Tablas Principales de Trazabilidad
- Identidad: `Unidades_Produccion`, `Secciones_Cultivo`
- Hacia Atrás: `Proveedores`, `Recepcion_Insumos`, `Insumos_Agricolas`
- Interna: `Bitacora_Actividades`, `Lotes_Cosecha`, `Detalle_Aplicacion_Insumos`
- Hacia Adelante: `Transportes`, `Clientes_Destinos`, `Historial_Transporte_Lotes`

---

## 🛠️ Instrucciones de Inicialización y Despliegue

### Requisitos Previos
- **Node.js** (v18 o superior)
- CLI de Supabase (`npx run supabase` o `npm install -g supabase`)

### Variables de Entorno Locales y Nube
Tu proyecto requiere un archivo `.env` en la raíz (para Express) y la configuración de "Secrets" en tu proyecto de Supabase (para Edge Functions). Asegura configurar:
- `SUPABASE_URL` / `SUPABASE_ANON_KEY` (Para la base web)
- `TELEGRAM_BOT_TOKEN` (De BotFather en Telegram)
- `GEMINI_API_KEY` (Para activar el modelo Gemini-2.5-flash)
- `SUPABASE_SERVICE_ROLE_KEY` (Bypass RLS para inserción desde el Bot)

### 1. Gestión del Servidor Express (API Web)
\`\`\`bash
npm install
# Iniciar servidor local:
npm run dev
# Producción:
npm run build && npm start
\`\`\`

### 2. Despliegue del Sistema Inteligente de Telegram (Edge Functions)
El Cerebro de IA se maneja íntegramente desde la infraestructura de la función `bot_dbz_web` de Supabase.

Para desplegar actualizaciones del bot de Telegram hacia Supabase:
\`\`\`bash
npx supabase functions deploy bot_dbz_web --no-verify-jwt --project-ref [TU_PROJECT_REF]
\`\`\`

### 3. Configurar Webhook de Telegram
Para enlazar Telegram con Supabase, después de desplegar la función, deberás ejecutar una solicitud una sola vez a la API de Telegram para configurar tu Webhook, por ejemplo:
\`\`\`bash
curl -X POST "https://api.telegram.org/bot[TELEGRAM_BOT_TOKEN]/setWebhook" -d "url=https://[TU_PROJECT_REF].supabase.co/functions/v1/bot_dbz_web"
\`\`\`

## 🧩 Scripts de Referencia de Base de Datos
En este repositorio se encuentran los archivos `db_scrip.txt`, `update_bot_tables.txt` y `sql_historial_chat.txt` los cuales son obligatorios para construir el esquema de base de datos dentro de Supabase e implementar la Seguridad RLS de las vistas.