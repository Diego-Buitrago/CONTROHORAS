const express = require('express')
const router = express.Router()
const {cnn_mysql} = require('../database/database');

router.post('/registrar_hora', async(req, res) => {
    try {
        const {
            hor_nombre,
            hor_codigo,
            hor_porcentaje,
            hor_usu_act,
            hor_fecha_act
        } = req.body
        
        const [rows, fields] = await cnn_mysql.promise().execute(
              'INSERT INTO horas(hor_nombre, hor_codigo, hor_porcentaje, hor_usu_act, hor_fecha_act) VALUES(?,?,?,?,?)', [hor_nombre, hor_codigo, hor_porcentaje, hor_usu_act, hor_fecha_act])
  
          if (rows.affectedRows > 0) {
              res.json({
                  id: rows.insertId,
                  hor_nombre: hor_nombre,
                  hor_codigo: hor_codigo,
                  hor_porcentaje: hor_porcentaje,
                  hor_usu_act: hor_usu_act,
                  hor_fecha_act: hor_fecha_act
              })
          } else {
              res.json({});
          }
    } catch (e) {
        console.log(e)
    }
});

router.post('/horas', async (req, res) => {
  
    cnn_mysql.query(`SELECT * FROM horas`, (error, resulset, fields) => {
      if (error) {
        return res.status(500).send('usuario no encontrado verifica datos')
      } else {
        return res.json(resulset);
      }
    })
});

router.get('/get_horas', async(req, res) => {
    const { id } = req.query
    
    cnn_mysql.query(`SELECT * FROM horas WHERE hor_id = ?`, [id], (error, resulset, fields) => {
      if (error) {
            return res.status(500).send('usuario no encontrado verifica datos')
        } else {
            return res.json(resulset);
        }
      })
});

router.put('/editar_hora', async(req, res) => {
    try {
      const {
        hor_nombre,
        hor_codigo,
        hor_porcentaje,
        hor_usu_act,
        hor_fecha_act,
        id
      } = req.body
      
        const [rows, fields] = await cnn_mysql.promise().execute(
            'UPDATE horas SET hor_nombre = ?, hor_codigo = ?, hor_porcentaje = ?, hor_usu_act = ?, hor_fecha_act = ? WHERE hor_id = ?', [hor_nombre, hor_codigo, hor_porcentaje, hor_usu_act, hor_fecha_act, id])
  
        if (rows.affectedRows > 0) {
            res.json({
                id: rows.insertId,
                hor_nombre: hor_nombre,
                hor_codigo: hor_codigo,
                hor_porcentaje: hor_porcentaje,
                hor_usu_act: hor_usu_act,
                hor_fecha_act: hor_fecha_act,
            })
        } else {
            res.json({});
        } 
    } catch (e) {
        console.log(e)
    }
});

router.delete('/eliminar_hora', async(req, res) => {
    const {id} = req.body
    
    cnn_mysql.query(`DELETE FROM horas WHERE hor_id = ?`, [id], (error, resulset, fields) => {
      if (error) {
          return res.status(500).send('se presento un error en la base de datos.')
      } else {
          return res.send(`Has eliminado con exito el registro con id ${id} en la tabla horas!!`)
      }
    })
});
  
module.exports = router