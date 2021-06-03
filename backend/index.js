const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.set('port', process.env.PORT || 5002);

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

//Importar rutas
app.use('/', require('./src/send_mail/send_mail'));
app.use('/', require('./src/routes/usuarios'));
app.use('/', require('./src/routes/perfiles'));
app.use('/', require('./src/routes/horas'));
app.use('/', require('./src/routes/costos'));
app.use('/', require('./src/routes/obras'));
app.use('/', require('./src/routes/registro_jornadas'));

app.listen(app.get('port'), ()=>{
   console.log(`Servidor conectado en el puerto ${app.get('port')}`);
});

module.exports = app