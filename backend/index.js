const express = require('express');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const app = express();

app.set('port', process.env.PORT || 5002);

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

/* const whitelist = ['http://localhost:3000', 'http://localhost:5000']

const corsOptions = {
   origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
         callback(null, true);
      } else {
         callback(new Error('Not allowed by CORS'))
      }
   }
} */

//Importar rutas
app.use('/', require('./src/routes/routes'));
app.use('/', require('./src/send_mail/send_mail'));

app.listen(app.get('port'), ()=>{
   console.log(`Servidor conectado en el puerto ${app.get('port')}`);
});

module.exports = app