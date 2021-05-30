const express = require("express");
const router = express.Router();
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

router.post('/enviar_mail', (req, res) => {
	let { to, subject } = req.body;
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
							<a href="http://localhost:3000/recover_password">pulsa aqui para recuperar</a>
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
	  } else {
		console.log(`sent: ${info.response}`);
		res.json({ message: 'Correo enviado' });
	  }
	});
  });
  
  module.exports = router;