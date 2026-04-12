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
import frontRoutes from './src/routes/front.routes'
import probar from './src/ping'
import { supabase } from './src/config/supabaseClient';
import cookieParser from 'cookie-parser';


require('path')
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(express.json())
app.use(cookieParser()) 

// Routes (Todas las rutas de la API primero)
app.use('/api/insumos', insumosRoutes)
app.use('/api/userAuth', userRoutes)
app.use('/api/up', upRoutes)
app.use('/api/logistica-insumos', proveedoresRoutes)
app.use('/api/produccion', produccionRoutes)
app.use('/api/logistica-envios', logisticaRoutes)
app.use('/api/reportes', reportesRoutes)
app.use('/api/front', frontRoutes)

// Health check (Puede ir antes o después de estáticos, pero antes de la ruta '/')
app.get('/ping', (req, res) => {
  res.json({ message: 'pong' })
  //probar
})

// Servir archivos estáticos y la página de Login (después de todas las APIs)
app.use(express.static(path.join(__dirname, 'public')))
//--------------------------------------------------- Rutas para front ---------------------------------------------------
//Login
app.get('/', async (req, res) => {
  const token = req.cookies?.access_token;
  const { data: { user }, error } = await supabase.auth.getUser(token);
  //Redirigir a dashboard si hay sesion iniciada
  if (!error && user) return res.redirect('/busqueda')
  res.sendFile(path.join(__dirname, 'public','html','index.html'))
})
//Pagina de info para externos
app.get('/ProductInfo/:id', (req, res) => {
  const { id } = req.params; 
  res.sendFile(path.join(__dirname, 'public', 'html','ProductInfo.html'));
});
//Pagina para trazabilidad hacia adelante y atras
app.get('/busqueda', async (req, res) => {
  const token = req.cookies?.access_token
  const { data: { user }, error } = await supabase.auth.getUser(token)
  //console.log(user);
  
  if (error || !user) return res.redirect('/')

  res.sendFile(path.join(__dirname, 'public', 'html', 'busqueda.html'))
})
//Pagina de manejo de usuarios
app.get('/editUsers', async (req, res) => {
  const token = req.cookies?.access_token
  const { data: { user }, error } = await supabase.auth.getUser(token)

  if (error || !user) return res.redirect('/')

  res.sendFile(path.join(__dirname, 'public', 'html', 'editUsuarios.html'))
})

//Ruta para logout
app.get('/logout', async(req, res) => {
  const { error } = await supabase.auth.signOut()
  if(error) return error;
  return res.redirect('/');
});

// --------------------------------------- Fin rutas front -----------------------------------------------------

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
}

// Archivos staticos para front
app.use(express.static(path.join(__dirname, 'public')));
// Front


export default app