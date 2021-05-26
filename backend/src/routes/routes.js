const express = require('express')
const router = express.Router()
const {pool} = require('../database/database')

router.get('/inicio_sesion', async (req, res) => {
    console.log("Entro por aca");
    let client = await pool.connect();
    const { use_correo, use_contrasena} = req.query;
    
    try {
        let result = await client.query(
          `SELECT * FROM usuarios WHERE use_correo = $1 and use_contrasena = $2`, [use_correo, use_contrasena]
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

router.get('/contrasena', async (req, res) => {
    let client = await pool.connect();
    const { email } = req.query;
    
    try {
        let result = await client.query(
          `SELECT contrasena FROM usuarios WHERE email = $1 `, [email]
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

router.post('/usuarios', async (req, res) => {
  let client = await pool.connect();
  const {use_nombre, use_apellido, use_documento} = req.body
  
  try {
      let result = await client.query(
        `SELECT id, use_nombre, use_apellido, use_correo, use_documento, use_tipo FROM usuarios WHERE 
        (use_nombre ILIKE REPLACE ('%${use_nombre}%', ' ', '%') OR '${use_nombre}' IS NULL OR 
        '${use_nombre}' = '' ) AND (use_apellido ILIKE REPLACE ('%${use_apellido}%', ' ', '%') OR '${use_apellido}'
        IS NULL OR '${use_apellido}' = '') AND (use_documento ILIKE REPLACE ('%${use_documento}%', ' ', '%') OR '${use_documento}' 
        IS NULL OR '${use_documento}' = '')`
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

router.post('/registrar_usuario', async(req, res) => {
  let client = await pool.connect();
    try {
        const {
            use_nombre,
            use_apellido,
            use_documento,
            use_correo,
            use_contrasena,
            use_tipo
        } = req.body
        const client = await pool.connect()
        const response = await client.query(
            'INSERT INTO usuarios(use_nombre, use_apellido, use_documento, use_correo, use_contrasena, use_tipo) VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
            [use_nombre, use_apellido, use_documento, use_correo, use_contrasena, use_tipo])

        if (response.rowsCount > 0) {
            res.json({
                id: response.rows[0].id,
                use_nombre: use_nombre,
                use_apellido: use_apellido,
                use_documento: use_documento,
                use_correo: use_correo,
                use_contrasena: use_contrasena,
                use_tipo: use_tipo
            })
        } else {
            res.json({});
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
    } finally {
        client.release(true);
    }
});

router.delete('/eliminar_usuario', async(req, res) => {
  const {id} = req.body
  let client = await pool.connect();

  try {
    let result = await client.query(
      `DELETE FROM usuarios WHERE id = $1`, [id]
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
  let client = await pool.connect();
  const { id } = req.query;
    
    try {
        let result = await client.query(
          `SELECT * FROM usuarios WHERE id = $1 `, [id]
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

router.put('/editar_usuario', async(req, res) => {
  let client = await pool.connect();
  try {
      const {
          use_nombre,
          use_apellido,
          use_documento,
          use_correo,
          use_tipo,
          use_id
      } = req.body
      const client = await pool.connect()
      const response = await client.query(
          'UPDATE usuarios SET use_nombre = $1, use_apellido = $2, use_documento = $3, use_correo = $4, use_tipo = $5 WHERE id = $6',
          [use_nombre, use_apellido, use_documento, use_correo, use_tipo, use_id])
          return res.json('veiculo no encontrado verifica datos');
     
  } catch (e) {
      console.log(e)
      res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
  } finally {
      client.release(true);
  }
});

router.post('/perfiles', async (req, res) => {
  let client = await pool.connect();
  const {per_nombre, per_estado} = req.body
  
  try {
      let result = await client.query(
        `SELECT id, per_nombre, per_estado FROM perfiles WHERE (per_nombre ILIKE REPLACE 
        ('%${per_nombre}%', ' ', '%') OR '${per_nombre}' IS NULL OR '${per_nombre}' = '')`
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

router.get('/get_perfil', async(req, res) => {
  let client = await pool.connect();
  const { id } = req.query;
    
    try {
        let result = await client.query(
          `SELECT * FROM perfiles WHERE id = $1 `, [id]
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

router.get('/perfiles_actvos', async(req, res) => {
  let client = await pool.connect();
  const { estado } = req.query;
    
    try {
        let result = await client.query(
          `SELECT * FROM perfiles WHERE per_estado = $1 `, [estado]
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

router.put('/editar_perfil', async(req, res) => {
  let client = await pool.connect();
  try {
      const {
          per_nombre,
          per_estado,
          per_id
      } = req.body
      const client = await pool.connect()
      const response = await client.query(
          'UPDATE perfiles SET per_nombre = $1, per_estado = $2 WHERE id = $3',
          [per_nombre, per_estado, per_id])
          return res.json('OK');
     
  } catch (e) {
      console.log(e)
      res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
  } finally {
      client.release(true);
  }
});

router.post('/registrar_perfil', async(req, res) => {
  let client = await pool.connect();
    try {
        const {
            per_nombre,
            per_estado,
        } = req.body
        const client = await pool.connect()
        const response = await client.query(
            'INSERT INTO perfiles(per_nombre, per_estado) VALUES($1, $2) RETURNING id',
            [per_nombre, per_estado])

        if (response.rowsCount > 0) {
            res.json({
                id: response.rows[0].id,
                per_nombre: per_nombre,
                per_estado: per_estado
            })
        } else {
            res.json({});
        }
    } catch (e) {
        console.log(e)
        res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
    } finally {
        client.release(true);
    }
});

router.delete('/eliminar_perfil', async(req, res) => {
  const {id} = req.body
  let client = await pool.connect();

  try {
    let result = await client.query(
      `DELETE FROM perfiles WHERE id = $1`, [id]
    );
    if (result.rowCount == 0) {
      return res.json('perfil no encontrado');
    } else {
        return res.json(result.rows);
    }
} catch (error) {
  console.log(error);
} finally {
  client.release(true);
}
});

router.post('/registrar_vehiculo', async(req, res) => {
  let client = await pool.connect();
  try {
      const {
        nro_placa,
        marca,
        linea,
        modelo,
        fecha_ven_seguro,
        fecha_ven_tecnomecanica
      } = req.body
      const client = await pool.connect()
      const response = await client.query(
          'INSERT INTO motocicletas(nro_placa, marca, linea, modelo, fecha_ven_seguro, fecha_ven_tecnomecanica) VALUES($1, $2, $3, $4, $5, $6)',
          [nro_placa, marca, linea, modelo, fecha_ven_seguro, fecha_ven_tecnomecanica])

      if (response.rowsCount > 0) {
          res.json({
              nro_placa: nro_placa,
              marca: marca,
              linea: linea,
              modelo: modelo,
              fecha_ven_seguro: fecha_ven_seguro,
              fecha_ven_tecnomecanica: fecha_ven_tecnomecanica
          })
      } else {
          res.json({});
      }
  } catch (e) {
      console.log(e)
      res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
  } finally {
      client.release(true);
  }
});

router.get('/vehiculos', async (req, res) => {
  let client = await pool.connect();
  
  try {
      let result = await client.query(
        `SELECT * FROM motocicletas`
      );
      if (result.rowCount == 0) {
        return res.json('veiculos no encontrados');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.get('/get_editar_vehiculo', async(req, res) => {
  let client = await pool.connect();
  const { placa } = req.query;
    
    try {
        let result = await client.query(
          `SELECT * FROM motocicletas WHERE nro_placa = $1 `, [placa]
        );
        if (result.rowCount == 0) {
          return res.json('veiculo no encontrado verifica datos');
        } else {
            return res.json(result.rows);
        }
    } catch (error) {
      console.log(error);
    } finally {
      client.release(true);
    }
});

router.put('/editar_vehiculo', async(req, res) => {
  let client = await pool.connect();
  try {
      const {
        nro_placa,
        marca,
        linea,
        modelo,
        fecha_ven_seguro,
        fecha_ven_tecnomecanica
      } = req.body
      const client = await pool.connect()
      const response = await client.query(
          'UPDATE motocicletas SET nro_placa = $1, marca = $2, linea = $3, modelo = $4, fecha_ven_seguro = $5, fecha_ven_tecnomecanica = $6 WHERE nro_placa = $7',
          [nro_placa, marca, linea, modelo, fecha_ven_seguro, fecha_ven_tecnomecanica, nro_placa])

      if (response.rowsCount > 0) {
          res.json({
            nro_placa: nro_placa,
            marca: marca,
            linea: linea,
            modelo: modelo,
            fecha_ven_seguro: fecha_ven_seguro,
            fecha_ven_tecnomecanica: fecha_ven_tecnomecanica
          })
      } else {
          res.json({});
      }
  } catch (e) {
      console.log(e.error)
      res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
  } finally {
      client.release(true);
  }
});

router.delete('/eliminar_vehiculo', async(req, res) => {
  const {placa} = req.body
  let client = await pool.connect();

  try {
    let result = await client.query(
      `DELETE FROM motocicletas WHERE nro_placa = $1`, [placa]
    );
    if (result.rowCount == 0) {
      return res.json('vehiculo no encontrado verifica datos');
    } else {
        return res.json(result.rows);
    }
} catch (error) {
  console.log(error);
} finally {
  client.release(true);
}
});

router.post('/registrar_seguimiento', async(req, res) => {
  let client = await pool.connect();
  try {
      const {
        placa_moto,
        marca: marca,
        linea: linea,
        fecha_reparacion,
        tipo_seguimiento,
        observaciones
      } = req.body
      const client = await pool.connect()
      const response = await client.query(
          'INSERT INTO seguimiento(placa_moto, marca, linea, fecha_reparacion, tipo_seguimiento, observaciones) VALUES($1, $2, $3, $4, $5, $6)',
          [placa_moto, marca, linea, fecha_reparacion, tipo_seguimiento, observaciones])

      if (response.rowsCount > 0) {
          res.json({
            id: response.rows[0].id,
            placa_moto: placa_moto,
            fecha_reparacion: fecha_reparacion,
            tipo_seguimiento: tipo_seguimiento,
            observaciones: observaciones
          })
      } else {
          res.json({});
      }
  } catch (e) {
      console.log(e.error)
      res.status(500).json({errorCode : e.errno, message : "Error en el servidor"});
  } finally {
      client.release(true);
  }
});

router.get('/seguimiento', async (req, res) => {
  let client = await pool.connect();
  const { placa } = req.query;
  
  try {
      let result = await client.query(
        `SELECT * FROM seguimiento WHERE placa_moto = $1`, [placa]
      );
      if (result.rowCount == 0) {
        return res.json('vehiculo no encontrado');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.post('/buscar', async(req, res) => {
  let client = await pool.connect();
  const { nro_placa, marca, linea, modelo } = req.body;
  
  try {
    let result = ''

    if(nro_placa !== '' && marca !== '' && linea !== '' && modelo !== '') {
      result = await client.query(
        `SELECT * FROM motocicletas WHERE nro_placa LIKE '%${nro_placa}%' AND marca = $1 AND linea = $2 AND modelo = $3`,
        [marca, linea, modelo]
      );
    } else if(nro_placa !== '' && marca !== '' && linea !== '' && modelo === '') {
      result = await client.query(
        `SELECT * FROM motocicletas WHERE nro_placa LIKE '%${nro_placa}%' AND marca = $1 AND linea = $2`,
        [marca, linea]
      );
    } else if(nro_placa !== '' && marca !== '' && linea === '' && modelo === '') {
      result = await client.query(
        `SELECT * FROM motocicletas WHERE nro_placa LIKE '%${nro_placa}%' AND marca = $1`, [marca]
      );
    } else if(nro_placa !== '' && marca === '' && linea === '' && modelo === '') {
      result = await client.query(
        `SELECT * FROM motocicletas WHERE nro_placa LIKE '%${nro_placa}%'`
      );
    } else if(nro_placa === '' && marca !== '' && linea === '' && modelo === '') {
      result = await client.query(
        `SELECT * FROM motocicletas WHERE marca = $1`, [marca]
      );
    } else if(nro_placa === '' && marca !== '' && linea !== '' && modelo === '') {
      result = await client.query(
        `SELECT * FROM motocicletas WHERE marca = $1 AND linea = $2`, [marca, linea]
      );
    } else if(nro_placa === '' && marca === '' && linea === '' && modelo !== '') {
      result = await client.query(
        `SELECT * FROM motocicletas WHERE modelo = $1`, [modelo]
      );
    } else if(nro_placa === '' && marca !== '' && linea === '' && modelo !== '') {
      result = await client.query(
        `SELECT * FROM motocicletas WHERE marca = $1 AND modelo = $2`, [marca, modelo]
      );
    }
      
      if (result.rowCount == 0) {
        return res.json('');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.get('/total_vehiculos', async (req, res) => {
  let client = await pool.connect();
  
  try {
      let result = await client.query(
        `SELECT COUNT(*) FROM motocicletas`
      );
      if (result.rowCount == 0) {
        return res.json('veiculos no encontrados');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.get('/total_vehiculos_mantenimiento', async (req, res) => {
  let client = await pool.connect();
  
  try {
      let result = await client.query(
        `SELECT COUNT(*) FROM motocicletas WHERE seguimiento = true`
      );
      if (result.rowCount == 0) {
        return res.json('veiculos no encontrados');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.get('/vehiculos_man', async (req, res) => {
  let client = await pool.connect();
  
  try {
      let result = await client.query(
        `SELECT * FROM motocicletas WHERE seguimiento = true`
      );
      if (result.rowCount == 0) {
        return res.json('veiculos no encontrados');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.get('/total_eliminados', async (req, res) => {
  let client = await pool.connect();
  
  try {
      let result = await client.query(
        `SELECT COUNT(*) FROM veihiculos_eliminados`
      );
      if (result.rowCount == 0) {
        return res.json('veiculos no encontrados');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.get('/total_eliminados', async (req, res) => {
  let client = await pool.connect();
  
  try {
      let result = await client.query(
        `SELECT COUNT(*) FROM veihiculos_eliminados`
      );
      if (result.rowCount == 0) {
        return res.json('veiculos no encontrados');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.get('/eliminados', async (req, res) => {
  let client = await pool.connect();
  
  try {
      let result = await client.query(
        `SELECT * FROM veihiculos_eliminados`
      );
      if (result.rowCount == 0) {
        return res.json('veiculos no encontrados');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.get('/tipo_seguimiento', async (req, res) => {
  let client = await pool.connect();
  const {tipo} = req.query
  
  try {
      let result = await client.query(
        `SELECT placa_moto FROM seguimiento WHERE tipo_seguimiento = $1 GROUP BY placa_moto`, [tipo]
      );
      if (result.rowCount == 0) {
        return res.json('veiculos no encontrados');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

router.get('/info_tipo_seguimiento', async (req, res) => {
  let client = await pool.connect();
  const {tipo} = req.query
  
  try {
      let result = await client.query(
        `SELECT * FROM seguimiento WHERE tipo_seguimiento = $1 ORDER BY placa_moto`, [tipo]
      );
      if (result.rowCount == 0) {
        return res.json('veiculos no encontrados');
      } else {
          return res.json(result.rows);
      }
  } catch (error) {
    console.log(error);
  } finally {
    client.release(true);
  }
});

module.exports = router