const express = require('express')
const router = express.Router()
const {cnn_mysql} = require('../database/database');
const moment = require('moment')

router.get('/tipo_novedades', async (req, res) => {
  
    cnn_mysql.query(`SELECT * FROM tipo_novedad`, (error, resulset, fields) => {
        if (error) {
            console.log(error)
            return res.status(500).send('No existe')
        } else {
            return res.json(resulset);
        }
    })
});

router.post('/cargar_dias', async(req, res) => {
    try {
        const {
            empleado,
            semana,
        } = req.body
        console.log(`SELECT STR_TO_DATE('${semana} Monday', '%x%v %W') LUN`)
        
        const [rows, fields] = await cnn_mysql.promise().execute(
            `SELECT STR_TO_DATE('${semana} Monday', '%x%v %W') LUN`)

        //console.log(moment(rows[0].LUN).format('YYYY-MM-DD'))
        let init = moment(rows[0].LUN).format('YYYY-MM-DD')
        for(let i = 1; i <= 7; i++) {
            console.log(init) 
            const [rowv, fields] = await cnn_mysql.promise().execute(
                `SELECT jod_id FROM jornada_dias WHERE use_id = ? AND jod_semana = ? AND jod_fecha = ?`, [empleado, semana, init])
                //console.log(rowv[0].jod_id)
            if (rowv <= 0) {
                const [rowd, fields] = await cnn_mysql.promise().execute(
                    'INSERT INTO jornada_dias(use_id, jod_semana, jod_fecha) VALUES(?,?,?)', [empleado, semana, init])
                    if(rowd){}
                    else {console.log('no inserto' + init)}
            } 
            else {console.log('existe' + rowv)}
            init =   moment(init).add(1, 'days');  
            init = moment(init).format('YYYY-MM-DD')

                  
        }
        const [rowdi, fielddi] = await cnn_mysql.promise().execute(
            `SELECT jod_id, jod_fecha FROM jornada_dias WHERE use_id = ? AND jod_semana = ?`, [empleado, semana]
          ); 
        /* 
          const [rows, fields] = await cnn_mysql.promise().execute(
            'SELECT * FROM usuarios WHERE use_estado !=2'
          ); */
          if (rowdi == 0) {
            return res.json('dias no encontrado verifica datos');
          } else {
              
              return res.json(rowdi);
          }
    } catch (e) {
        console.log(e)
    }
});

module.exports = router