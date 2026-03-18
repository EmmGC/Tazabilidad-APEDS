import express from 'express'
import dotenv from 'dotenv'
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

// Routes
app.use('/api/insumos', insumosRoutes)
app.use('/api/userAuth', userRoutes)
app.use('/api/up', upRoutes)
app.use('/api/logistica-insumos', proveedoresRoutes)
app.use('/api/produccion', produccionRoutes)
app.use('/api/logistica-envios', logisticaRoutes)
app.use('/api/reportes', reportesRoutes)

// Health check
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' })
  probar
})

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

export default app