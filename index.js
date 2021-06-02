require('dotenv').config();

const { response } = require('express');
const express = require('express');

const cors = require('cors')
const { dbConection } = require('./database/config')

// Crea el Sevidor de Express
const app = express();
//base de datos
dbConection();
//dIRECCION PUBLICA
app.use (express.static('public'));
//Configurar Cors 
app.use(cors())
//LECTURA  Y PARSEO DEL BODY
app.use(express.json());
// Usuarios que importar
app.use('/api/usuarios',require('./routes/usuarios'));
app.use('/api/hospitales',require('./routes/hospitales'));
app.use('/api/medicos',require('./routes/medicos'));
app.use('/api/login',require('./routes/auth'));
app.use('/api/todo',require('./routes/busquedas'));
app.use('/api/upload',require('./routes/uploads'));
//Rutas


app.listen(process.env.PORT, () => {
    console.log('Servidor Corriendo en puerto ' + process.env.PORT)
});