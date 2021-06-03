const express = require('express')
const router = express.Router()
const {cnn_mysql} = require('../database/database');

router.get('/get_directores', async(req, res) => {
    
    cnn_mysql.query(`SELECT * FROM usuarios WHERE per_id = 4 AND use_estado = 1`, (error, resulset, fields) => {
      if (error) {
            return res.status(500).send('usuario no encontrado verifica datos')
        } else {
            return res.json(resulset);
        }
      })
});

router.post('/registrar_obra', async(req, res) => {
    try {
        const {
            obr_nombre,
            obr_val_operador,
            obr_val_maquina,
            use_id,
            obr_horas_mes,
            cos_id,
            obr_lunes,
            obr_martes,
            obr_miercoles,
            obr_jueves,
            obr_viernes,
            obr_sabado,
            obr_domingo,
            obr_usu_act,
            obr_fecha_act
        } = req.body
        
        const [rows, fields] = await cnn_mysql.promise().execute(
              'INSERT INTO obras(obr_nombre, obr_val_operador, obr_val_maquina, use_id, obr_horas_mes, cos_id, obr_lunes, obr_martes, obr_miercoles, obr_jueves, obr_viernes, obr_sabado, obr_domingo, obr_usu_act, obr_fecha_act) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
              [obr_nombre, obr_val_operador, obr_val_maquina, use_id, obr_horas_mes, cos_id, obr_lunes, obr_martes, obr_miercoles, obr_jueves, obr_viernes, obr_sabado, obr_domingo,  obr_usu_act, obr_fecha_act])
  
          if (rows.affectedRows > 0) {
              res.json({
                    id: rows.insertId,
                    obr_nombre: obr_nombre,
                    obr_val_operador: obr_val_operador,
                    obr_val_maquina: obr_val_maquina,
                    use_id: use_id,
                    obr_horas_mes: obr_horas_mes,
                    cos_id: cos_id,
                    obr_lunes: obr_lunes,
                    obr_martes: obr_martes,
                    obr_miercoles: obr_miercoles,
                    obr_jueves: obr_jueves,
                    obr_viernes: obr_viernes,
                    obr_sabado: obr_sabado,
                    obr_domingo: obr_domingo,
                    obr_usu_act: obr_usu_act,
                    obr_fecha_act: obr_fecha_act
              })
          } else {
              res.json({});
          }
    } catch (e) {
        console.log(e)
    }
});

router.post('/obras', async (req, res) => {
  
    cnn_mysql.query(`SELECT * FROM obras`, (error, resulset, fields) => {
      if (error) {
        return res.status(500).send('obra no encontrada')
      } else {
        return res.json(resulset);
      }
    })
});

router.get('/get_obras', async(req, res) => {
    const { id } = req.query
    
    cnn_mysql.query(`SELECT * FROM obras WHERE obr_id = ?`, [id], (error, resulset, fields) => {
      if (error) {
            return res.status(500).send('obra no encontrada')
        } else {
            return res.json(resulset);
        }
      })
});

router.put('/editar_obra', async(req, res) => {
    try {
      const {
            obr_nombre,
            obr_val_operador,
            obr_val_maquina,
            use_id,
            obr_horas_mes,
            cos_id,
            obr_lunes,
            obr_martes,
            obr_miercoles,
            obr_jueves,
            obr_viernes,
            obr_sabado,
            obr_domingo,
            obr_usu_act,
            obr_fecha_act,
            id
      } = req.body
      
        const [rows, fields] = await cnn_mysql.promise().execute(
            'UPDATE obras SET obr_nombre = ?, obr_val_operador = ?, obr_val_maquina = ?, use_id = ?, obr_horas_mes = ?, cos_id = ?, obr_lunes = ?, obr_martes = ?, obr_miercoles = ?, obr_jueves = ?, obr_viernes = ?, obr_sabado = ?, obr_domingo = ?, obr_usu_act = ?, obr_fecha_act = ? WHERE obr_id = ?', [obr_nombre, obr_val_operador, obr_val_maquina, use_id, obr_horas_mes, cos_id, obr_lunes, obr_martes, obr_miercoles, obr_jueves, obr_viernes, obr_sabado, obr_domingo,  obr_usu_act, obr_fecha_act, id])
  
        if (rows.affectedRows > 0) {
            res.json({
                id: rows.insertId,
                obr_nombre: obr_nombre,
                obr_val_operador: obr_val_operador,
                obr_val_maquina: obr_val_maquina,
                use_id: use_id,
                obr_horas_mes: obr_horas_mes,
                cos_id: cos_id,
                obr_lunes: obr_lunes,
                obr_martes: obr_martes,
                obr_miercoles: obr_miercoles,
                obr_jueves: obr_jueves,
                obr_viernes: obr_viernes,
                obr_sabado: obr_sabado,
                obr_domingo: obr_domingo,
                obr_usu_act: obr_usu_act,
                obr_fecha_act: obr_fecha_act
            })
        } else {
            res.json({});
        } 
    } catch (e) {
        console.log(e)
    }
});

router.delete('/eliminar_obra', async(req, res) => {
    const {id} = req.body
    
    cnn_mysql.query(`DELETE FROM obras WHERE obr_id = ?`, [id], (error, resulset, fields) => {
      if (error) {
          return res.status(500).send('se presento un error en la base de datos.')
      } else {
          return res.send(`Has eliminado con exito el registro con id ${id} en la tabla obras!!`)
      }
    })
});
  
module.exports = router