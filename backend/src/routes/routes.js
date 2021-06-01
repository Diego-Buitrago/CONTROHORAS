const express = require('express')
const router = express.Router()
const {cnn_mysql} = require('../database/database');
const {Valida_crearUsuario, Valida_crearPerfil} = require('../Validations/Validations')
const bcrypt = require('bcryptjs')

router.get('/inicio_sesion', async(req, res) => {
    const { use_correo, use_contrasena} = req.query;
    
    try {
        const [rows, fields] = await cnn_mysql.promise().execute(`SELECT use_correo FROM use_correo = ?`, 
        [use_correo]);
        if (rows == 0) {
          return res.json('usuario no encontrado verifica datos');
        } else {
            
            console.log(rows[0].use_contrasena)
            const matchPassword = await bcrypt.compare(use_contrasena, rows[0].use_contrasena);

            if(matchPassword) {
              return res.json(rows);
            } else {
              return res.status(400).json({message: "contraseña invalida"});
            }
        }
    } catch (error) {
      console.log(error);
    }
});


router.put('/actulizar_contrasena', async(req, res) => {
  const  { use_contrasena, use_correo } = req.body

  const salt = await bcrypt.genSalt(10)
  const text = await bcrypt.hash(use_contrasena, salt)

  
  try {
      const [rows, fields] = await cnn_mysql.promise().execute(`UPDATE usuarios SET 
      use_contrasena = ? WHERE use_correo = ?`, [text, use_correo]);
      if (row == 0) {
        return res.json('Error al guardar');
      } else {
          
          return res.json(rows);
      }
  } catch (error) {
    console.log(error);
  }
})

router.post('/usuarios', async (req, res) => {
 
  const {use_nombre, use_apellido, use_documento} = req.body
  
  try {
    console.log(`SELECT u.id, u.use_nombre, u.use_apellido, u.use_correo, u.use_documento,u.use_tipo,p.per_nombre FROM usuarios join perfiles p on p.id=u.use_tipo WHERE (use_nombre LIKE REPLACE ('%${use_nombre}%', ' ', '%') OR '${use_nombre}' IS NULL OR 
    '${use_nombre}' = '' ) AND (use_apellido LIKE REPLACE ('%${use_apellido}%', ' ', '%') OR '${use_apellido}' IS NULL OR '${use_apellido}' = '') AND (use_documento LIKE REPLACE ('%${use_documento}%', ' ', '%') OR '${use_documento}' 
    IS NULL OR '${use_documento}' = '') AND use_estado !=2 `)
    const [rows, fields] = await cnn_mysql.promise().execute(
        `SELECT u.use_id, u.use_nombre, u.use_apellido, u.use_correo, u.use_documento,u.per_id,p.per_nombre FROM usuarios u join perfiles p on p.per_id=u.per_id WHERE  use_estado !=2 `
      ); 
    /* 
      const [rows, fields] = await cnn_mysql.promise().execute(
        'SELECT * FROM usuarios WHERE use_estado !=2'
      ); */
      if (rows == 0) {
        return res.json('usuario no encontrado verifica datos');
      } else {
          
          return res.json(rows);
      }
  } catch (error) {
    console.log(error);
  }
});

router.post('/registrar_usuario', async(req, res) => {
    try {
        const {
            use_nombre,
            use_apellido,
            use_documento,
            use_correo,
            use_fecha_ingreso,
            use_salario,
            use_firma,
            use_contrasena,
            per_id,
            use_usu_act,
            use_fecha_act
        } = req.body
        //const value = await Valida_crearUsuario.validateAsync(req.body);

        const salt = await bcrypt.genSalt(10)
        const text = await bcrypt.hash(use_contrasena, salt)

        const [rows, fields] = await cnn_mysql.promise().execute(
            'INSERT INTO usuarios(use_nombre, use_apellido, use_documento, use_correo, use_fecha_ingreso, use_salario_basico, use_firma, use_contrasena, per_id, use_usu_act, use_fecha_act) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
            [use_nombre, use_apellido, use_documento, use_correo, use_fecha_ingreso, use_salario, use_firma, text, per_id, use_usu_act, use_fecha_act]
        );

        if (rows.affectedRows > 0) {
            res.json({
                id: rows.insertId,
                use_nombre: use_nombre,
                use_apellido: use_apellido,
                use_documento: use_documento,
                use_correo: use_correo,
                use_fecha_ingreso: use_fecha_ingreso,
                use_salario: use_salario,
                use_firma: use_firma,
                use_contrasena: use_contrasena,
                per_id: per_id,
                use_usu_act: use_usu_act,
                use_fecha_act: use_fecha_act
            })
        } else {
            res.json({});
        }
    } catch (e) {
        console.log(e)
        if(e.constraint === 'usuarios_use_correo_key') {
          res.status(501).json({errorCode : e.errno, message: 'Correo duplicado'})
        } else if (e.constraint === 'usuarios_use_documento_key') {
          res.status(502).json({errorCode : e.errno, message: 'Correo duplicado'})
        } else {
          res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
        }
    }
});

router.delete('/eliminar_usuario', async(req, res) => {
  const {id} = req.body

  try {
    let result = await client.query(
      `UPDATE usuarios SET use_estado = 2 WHERE id = $1`, [id]
    );
    if (result.rowCount == 0) {
      return res.json('usuario no encontrado verifica datos');
    } else {
        return res.json(result.rows);
    }
} catch (error) {
  console.log(error);
} finally {
  client.release(true);
}
});

router.get('/get_editar', async(req, res) => {
  const { id } = req.query;
    
    cnn_mysql.query(`SELECT * FROM usuarios WHERE use_id = ?`, [id], (error, resulset, fields) => {
      if (error) {
          return res.status(500).send('se presento un error en la base de datos.')
      } else {
          return res.json(resulset);
      }
    })
});

router.put('/editar_usuario', async(req, res) => {
  
  try {
      const {
        use_nombre,
        use_apellido,
        use_documento,
        use_correo,
        use_fecha_ingreso,
        use_salario,
        use_firma,
        per_id,
        use_usu_act,
        use_fecha_act
      } = req.body
      const [rows, fields] = await cnn_mysql.promise().execute(
          'UPDATE usuarios SET use_nombre = ?, use_apellido = $2, use_documento = $3, use_correo = $4, use_tipo = $5 WHERE id = $6',
          [use_nombre, use_apellido, use_documento, use_correo, use_tipo, use_id])
          return res.json('veiculo no encontrado verifica datos');
     
  } catch (e) {
    console.log(e)
    if(e.constraint === 'usuarios_use_correo_key') {
       res.status(501).json({errorCode : e.errno, message: 'Correo duplicado'})
    } else if (e.constraint === 'usuarios_use_documento_key') {
      res.status(502).json({errorCode : e.errno, message: 'Correo duplicado'})
    } else {
      res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
    }
  } 
});

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
        return res.send(`Has eliminado con exito el registro con id ${id} en la tabla tipo_marca!!`)
    }
  })
});

module.exports = router