# Trazabilidad Agrícola - Backend API

Esta es la API backend para el Sistema de Trazabilidad Agrícola, desarrollada utilizando **Node.js, Express, TypeScript, y Supabase** como base de datos y proveedor de Autenticación.

El sistema se compone de los siguientes módulos principales:
1. **Identidad (Datos Maestros):** Unidades de Producción (UP), Secciones de Cultivo.
2. **Trazabilidad Hacia Atrás:** Recepción de Insumos, Proveedores.
3. **Trazabilidad Interna:** Bitácoras de Actividades, Lotes de Cosecha, Generación de Código Único de Trazabilidad.
4. **Trazabilidad Hacia Adelante:** Clientes Destino, Transportes e Historial de Embarques.
5. **Reportes y Herramientas Especiales:** Generación de PDF para Auditoría, Rastreo Bidireccional (Recall), Generadores de Códigos QR.

---

## 🚀 Requisitos Previos

Asegúrate de tener instalado en tu computadora:
- **Node.js** (v18 o superior)
- **NPM** (viene incluido con Node)

---

## 🛠️ Instrucciones de Ejecución Local

### 1. Variables de Entorno (`.env`)

Para que el servidor se conecte a la base de datos, debes crear un archivo `.env` en la raíz del proyecto (al lado de `package.json`) y agregar tus credenciales de Supabase:

```env
PORT=3001
SUPABASE_URL=tu_url_de_supabase_aqui
SUPABASE_ANON_KEY=tu_anon_key_de_supabase_aqui
```
Pidele el documento a alguien dentro del proyecto

### 2. Instalar Dependencias

Abre tu terminal en la carpeta del proyecto y ejecuta el siguiente comando para instalar todo desde el `package.json`:

```bash
npm install
```

**De forma alternativa**, si quieres asegurarte de instalar exactamente todos los paquetes base y utilidades (PDF, QR) desde cero, ejecuta estos dos comandos:

**Dependencias base:**
```bash
npm install express dotenv @supabase/supabase-js date-fns pdfkit qrcode
```

**Dependencias de desarrollo (Tipos y TypeScript):**
```bash
npm install --save-dev typescript ts-node ts-node-dev @types/express @types/node @types/pdfkit @types/qrcode
```

### 3. Ejecutar el Servidor en Modo Desarrollo

Levanta el servidor en modo desarrollo utilizando `ts-node-dev` (esto hará que el servidor se reinicie automáticamente si haces cambios en el código):

```bash
npm run dev
```

Deberías ver en tu consola el mensaje: `Server running on port 3001`.

---

## 📦 Construcción para Producción

Si deseas generar el código JavaScript transpilado para subirlo a un servidor en la nube (como Render, Heroku o AWS):

```bash
# Compilar el código TypeScript a JavaScript
npm run build

# Iniciar el servidor de producción (desde la carpeta dist)
npm start
```

---

## 🔗 Estructura de Rutas Base

Todas las rutas inician con el prefijo `/api`:

- **Usuarios y Auth:** `/api/userAuth`
- **Fichas e Insumos:** `/api/insumos`
- **Identidad (UP y Secciones):** `/api/up`
- **Recepción y Proveedores:** `/api/logistica-insumos`
- **Bitácoras y Lotes:** `/api/produccion`
- **Despachos y Clientes:** `/api/logistica-envios`
- **Reportes (Recall, PDF, QR):** `/api/reportes`