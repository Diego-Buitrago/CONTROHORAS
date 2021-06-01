const express = require('express')
const router = express.Router()
const {cnn_mysql} = require('../database/database');

router.post('/perfiles', async (req, res) => {
  
  cnn_mysql.query(`SELECT * FROM perfiles`, (error, resulset, fields) => {
    if (error) {
      return res.status(500).send('se presento un error en la base de datos.')
    } else {
      return res.json(resulset);
    }
  })
});
  
router.get('/get_perfil', async(req, res) => {
  const { id } = req.query
  
  cnn_mysql.query(`SELECT * FROM perfiles WHERE per_id = ?`, [id], (error, resulset, fields) => {
    if (error) {
          return res.status(500).send('se presento un error en la base de datos.')
      } else {
          return res.json(resulset);
      }
    })
  });
  
  router.get('/perfiles_activos', async(req, res) => {
   
    cnn_mysql.query(`SELECT * FROM perfiles WHERE per_estado = 1`, (error, resulset, fields) => {
      if (error) {
          return res.status(500).send('se presento un error en la base de datos.')
      } else {
          return res.json(resulset);
      }
    })
});
  
router.post('/registrar_perfil', async(req, res) => {
      try {
          const {
              per_nombre,
              per_estado,
              per_usu_act,
              per_fecha_act
          } = req.body
          //const value = await Valida_crearPerfil.validateAsync(req.body);
          
          const [rows, fields] = await cnn_mysql.promise().execute(
                'INSERT INTO perfiles(per_nombre, per_estado, per_usu_act, per_fecha_act) VALUES(?,?,?,?)',
                [per_nombre, per_estado, per_usu_act, per_fecha_act])
  
            if (rows.affectedRows > 0) {
                res.json({
                    id: rows.insertId,
                    per_nombre: per_nombre,
                    per_estado: per_estado,
                    per_usu_act: per_usu_act,
                    per_fecha_act: per_fecha_act
                })
            } else {
                res.json({});
            }
         
      } catch (e) {
          console.log(e)
          if(e.code === '23505') {
            res.status(501).json({errorCode : e.errno, message: 'Nombre duplicado'})
          } else {
            res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
          }
      }
});
  
router.put('/editar_perfil', async(req, res) => {
    try {
      const {
          per_nombre,
          per_estado,
          per_usu_act,
          per_fecha_act,
          per_id
      } = req.body
      //const value = await Valida_crearPerfil.validateAsync(req.body)
      
      const [rows, fields] = await cnn_mysql.promise().execute(
            'UPDATE perfiles SET per_nombre = ?, per_estado = ?, per_usu_act = ?, per_fecha_act = ? WHERE per_id = ?',
            [per_nombre, per_estado, per_usu_act, per_fecha_act, per_id])
  
        if (rows.affectedRows > 0) {
            res.json({
                id: rows.insertId,
                per_nombre: per_nombre,
                per_estado: per_estado,
                per_usu_act: per_usu_act,
                per_fecha_act: per_fecha_act
            })
        } else {
            res.json({});
        }
     
  } catch (e) {
      console.log(e)
      if(e.code === '23505') {
        res.status(501).json({errorCode : e.errno, message: 'Nombre duplicado'})
      } else {
        res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
      }
  }
});
  
router.delete('/eliminar_perfil', async(req, res) => {
    const {id} = req.body
    
    cnn_mysql.query(`DELETE FROM perfiles WHERE per_id = ?`, [id], (error, resulset, fields) => {
      if (error) {
          return res.status(500).send('se presento un error en la base de datos.')
      } else {
          return res.send(`Has eliminado con exito el registro con id ${id} en la tabla perfiles!!`)
      }
    })
});

module.exports = router