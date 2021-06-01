const express = require("express");
const router = express.Router();
const {cnn_mysql} = require('../database/database');
require('dotenv').config();

// importar libreria nodemailer
const smtpTransport = require("nodemailer-smtp-transport");
const nodemailer = require("nodemailer");

// configuracion nodemailer
let transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: process.env.EM_USER,
      pass: process.env.EM_PASS
    },
  })
);

router.post('/enviar_mail', async (req, res) => {
	let { to, subject, fec} = req.body;


	try {
        const [rows, fields] = await cnn_mysql.promise().execute(`SELECT use_id FROM usuarios WHERE use_correo = ?`, [to]);

        if (rows == 0) {
          return res.status(500).json('usuario no encontrado');
        } else {
            const use_id = rows[0].use_id;
			const random = Math.random() 

			const [rowsv, fieldsv] = await cnn_mysql.promise().execute(`SELECT rec_id FROM recuperar WHERE use_id = ?`, [use_id]);
			///verificar si el usuario tiene un codigo de recuperacion activo
			// si si sacar mensaje de que cuenta con un codigo actvio si no envia
			
			if(rowsv.length > 0)
			{
				//update 
				console.info("Actualizo");
				const [rowsi, fieldsi] = await cnn_mysql.promise().execute(`UPDATE recuperar SET 
				rec_codigo = ?, rec_estado = 1, rec_email = ?, rec_fecha = ?  WHERE use_id = ?`, [random, to, fec, use_id]);
				//mensaje de que tiene un codigo activo
			}
			else
			{
				//inserta como nuevo
				console.log("Inserto");
				const [rowsi, fieldsi] = await cnn_mysql.promise().execute(
					'INSERT INTO recuperar(rec_codigo, rec_estado, use_id, rec_email,rec_fecha) VALUES(?,?,?,?,?)',
					[random, 1, use_id, to, fec ]
				);
				exist =  rowsi.affectedRows;
			}
				
				contentHTML = `<!DOCTYPE html>
				<html lang="en">
				
				<head>
					<meta charset="UTF-8">
					<meta name="viewport" content="width=device-width, initial-scale=1.0">
					<title></title>
				</head>
				
				<body style="background-color:#2271b3">
					<div style="max-width: 625px;
						margin-top: 100px;
						margin-left: auto;
						background-color: white;
						margin-bottom: 0;
						border-radius: 10px;
						margin-right: auto
						">
						<table border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;
						border-bottom-style:none;
						border-right-style:none;
						border-top-style:none;
						border-left-style:none;
						font-family:Helvetica,
						Arial,sans-serif" width="100%">
							<tbody>
								<tr>
									<td><img src="https://image.freepik.com/vector-gratis/diseno-fondo-seguridad_1300-256.jpg"
											style="margin: 30px auto 30px 35px;
											width: 60%"></td>
								</tr>
									<td>
										<div style="margin-top:20px;
											margin-left: 35px;
											margin-bottom: 30px;
											">
											<span style="font-family: Arial, Helvetica, sans-serif;
											">Hola solicitaste recuperar tu contraseña.
											</span>
										</div>
				
									</td>
								</tr>
								<tr>
									<td>
										<a href="http://localhost:3000/recover_password?email=${to}&cod=${random}">pulsa aqui para recuperar</a>
									</td>
								</tr>
								
							</tbody>
						</table>
					</div>
				</body>
				
				</html>`;
				const mailOptions = {
				from: 'Diego Buitrago',
				to: to,
				subject: subject,
				html: contentHTML,
				};
			
				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
						return res.json(error);
						
					} else {
						console.log(`sent: ${info.response}`);
						return res.json({ message: 'Correo enviado' });
					}
				});
			
        }
    } catch (error) {
		console.log(error);
		return res.json(error);
      
    }
	//VERIFICAR QUE TO SEA UN CORREO EXISTENTE
	//CREAR TABLA RECUPERA PARA INGRESAR EL CODIGO RANDOM ACTIVO ASOCOCIADO AL USARIO
	
  });
  
  module.exports = router;