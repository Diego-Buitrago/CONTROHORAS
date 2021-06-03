const express = require('express')
const router = express.Router()
const {cnn_mysql} = require('../database/database');

router.post('/registrar_costo', async(req, res) => {
    try {
        const {
            cos_nombre,
            cos_codigo,
            cos_usu_act,
            cos_fecha_act
        } = req.body
        
        const [rows, fields] = await cnn_mysql.promise().execute(
              'INSERT INTO centro_costos(cos_nombre, cos_codigo, cos_usu_act, cos_fecha_act) VALUES(?,?,?,?)', [cos_nombre, cos_codigo, cos_usu_act, cos_fecha_act])
  
          if (rows.affectedRows > 0) {
              res.json({
                    id: rows.insertId,
                    cos_nombre: cos_nombre,
                    cos_codigo: cos_codigo,
                    cos_usu_act: cos_usu_act,
                    cos_fecha_act: cos_fecha_act
              })
          } else {
              res.json({});
          }
    } catch (e) {
        console.log(e)
    }
});

router.post('/costos', async (req, res) => {
  
    cnn_mysql.query(`SELECT * FROM centro_costos`, (error, resulset, fields) => {
      if (error) {
        return res.status(500).send('usuario no encontrado verifica datos')
      } else {
        return res.json(resulset);
      }
    })
});

router.get('/get_costos', async(req, res) => {
    const { id } = req.query
    
    cnn_mysql.query(`SELECT * FROM centro_costos WHERE cos_id = ?`, [id], (error, resulset, fields) => {
      if (error) {
            return res.status(500).send('usuario no encontrado verifica datos')
        } else {
            return res.json(resulset);
        }
      })
});

router.put('/editar_costo', async(req, res) => {
    try {
      const {
        cos_nombre,
        cos_codigo,
        cos_usu_act,
        cos_fecha_act,
        id
      } = req.body
      
        const [rows, fields] = await cnn_mysql.promise().execute(
            'UPDATE centro_costos SET cos_nombre = ?, cos_codigo = ?, cos_usu_act = ?, cos_fecha_act = ? WHERE cos_id = ?', [cos_nombre, cos_codigo, cos_usu_act, cos_fecha_act, id])
  
        if (rows.affectedRows > 0) {
            res.json({
                id: rows.insertId,
                cos_nombre: cos_nombre,
                cos_codigo: cos_codigo,
                cos_usu_act: cos_usu_act,
                cos_fecha_act: cos_fecha_act,
            })
        } else {
            res.json({});
        } 
    } catch (e) {
        console.log(e)
    }
});

router.delete('/eliminar_costo', async(req, res) => {
    const {id} = req.body
    
    cnn_mysql.query(`DELETE FROM centro_costos WHERE cos_id = ?`, [id], (error, resulset, fields) => {
      if (error) {
          return res.status(500).send('se presento un error en la base de datos.')
      } else {
          return res.send(`Has eliminado con exito el registro con id ${id} en la tabla horas!!`)
      }
    })
});
  
module.exports = router