import express from 'express'
import dotenv from 'dotenv'
import insumosRoutes from './src/routes/insumos.routes'
import userRoutes from './src/routes/users.routes'
import probar from './src/ping'
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())

// Routes
app.use('/api/insumos', insumosRoutes)
app.use('/api/userAuth', userRoutes)

// Health check
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' })
  probar
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app