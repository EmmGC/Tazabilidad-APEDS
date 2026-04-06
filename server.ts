import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import insumosRoutes from './src/routes/insumos.routes'
import userRoutes from './src/routes/users.routes'
import upRoutes from './src/routes/up.routes'
import proveedoresRoutes from './src/routes/proveedores.routes'
import produccionRoutes from './src/routes/produccion.routes'
import logisticaRoutes from './src/routes/logistica.routes'
import reportesRoutes from './src/routes/reportes.routes'
import probar from './src/ping'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())

// Routes (Todas las rutas de la API primero)
app.use('/api/insumos', insumosRoutes)
app.use('/api/userAuth', userRoutes)
app.use('/api/up', upRoutes)
app.use('/api/logistica-insumos', proveedoresRoutes)
app.use('/api/produccion', produccionRoutes)
app.use('/api/logistica-envios', logisticaRoutes)
app.use('/api/reportes', reportesRoutes)

// Health check (Puede ir antes o después de estáticos, pero antes de la ruta '/')
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' })
  probar
})

// Servir archivos estáticos y la página de Login (después de todas las APIs)
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app