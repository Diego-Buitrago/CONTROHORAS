const Joi = require('joi')

const Valida_crearUsuario = Joi.object({
    use_nombre: Joi.string()
                .required()
                .min(4)
                .max(20)
                .alphanum(),
    use_apellido: Joi.string()
                .required()
                .min(4)
                .max(20)
                .alphanum(),
    use_documento: Joi.string()
                .required()
                .min(6)
                .max(10),
    use_correo: Joi.string()
                .required()
                .email(),
    use_contrasena: Joi.string()
                .required(),
                //.pattern(new RegExp('^(?=.*\d)(?=.*[\u0021-\u002b\u003c-\u0040])(?=.*[A-Z])(?=.*[a-z])\S{8,10}$')),
    use_tipo: Joi//.number()
                .required()
})

const Valida_crearPerfil = Joi.object({
    per_nombre: Joi.string()
                .required()
                .min(4)
                .max(20).alphanum(),
    per_estado: Joi.number()
                .required()
})

module.exports = { Valida_crearUsuario, Valida_crearPerfil}