DROP DATABASE IF EXISTS DB_POTENCO;

DROP TABLE IF EXISTS Perfiles;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS centro_costos;
DROP TABLE IF EXISTS horas;
DROP TABLE IF EXISTS obras;
DROP TABLE IF EXISTS costos;

CREATE DATABASE DB_POTENCO; 

CREATE TABLE perfiles(
    per_id INT(5) PRIMARY KEY AUTO_INCREMENT,
    per_nombre VARCHAR(50) NOT NULL UNIQUE,
    per_estado INT(5) NOT NULL,
    per_usu_act VARCHAR(50) NOT NULL,
    per_fecha_act DATE NOT NULL
);

CREATE TABLE horas(
    hor_id INT(5) PRIMARY KEY AUTO_INCREMENT,
    hor_nombre VARCHAR(50) NOT NULL UNIQUE,
    hor_codigo INT(50) NOT NULL UNIQUE,
    hor_Porcentaje DOUBLE,
    hor_usu_act VARCHAR(50) NOT NULL,
    hor_fecha_act DATE NOT NULL
);

CREATE TABLE usuarios(
    use_id INT(5) PRIMARY KEY AUTO_INCREMENT,
    use_nombre VARCHAR(50) NOT NULL,
    use_apellido VARCHAR(50) NOT NULL,
    use_documento VARCHAR(50) NOT NULL UNIQUE, 
    use_correo VARCHAR(50) NOT NULL UNIQUE,
    use_contrasena VARCHAR(100) NOT NULL,
    use_fecha_ingreso DATE NOT NULL,
    use_salario_basico DOUBLE NOT NULL,
    use_firma VARCHAR(100),
    use_estado INTEGER DEFAULT 1,
    per_id INT(5),
    use_usu_act VARCHAR(50) NOT NULL,
    use_fecha_act DATE NOT NULL
);

CREATE TABLE centro_costos(
    cos_id INT(5) PRIMARY KEY AUTO_INCREMENT,
    cos_nombre VARCHAR(50) NOT NULL UNIQUE,
    cos_codigo INT(50) NOT NULL UNIQUE,
    cos_usu_act VARCHAR(50) NOT NULL,
    cos_fecha_act DATE NOT NULL
);

CREATE TABLE obras(
    obr_id INT(5) PRIMARY KEY AUTO_INCREMENT,
    obr_nombre VARCHAR(50),
    obr_val_operador DOUBLE NOT NULL,
    obr_val_maquina DOUBLE NOT NULL,
    use_id INT(5),
    obr_horas_mes INT(5) NOT NULL,
    cos_id INT(5),
    obr_lunes INT(5) NOT NULL,
    obr_martes INT(5) NOT NULL,
    obr_miercoles INT(5) NOT NULL,
    obr_jueves INT(5) NOT NULL,
    obr_viernes INT(5) NOT NULL,
    obr_sabado INT(5) NOT NULL,
    obr_domingo INT(5) NOT NULL,
    obr_usu_act VARCHAR(50) NOT NULL,
    obr_fecha_act DATE NOT NULL
);

ALTER TABLE usuarios 
ADD CONSTRAINT `fk_usuarios_perfiles` 
FOREIGN KEY (`per_id`) 
REFERENCES `perfiles` (`per_id`);

ALTER TABLE obras 
ADD CONSTRAINT `fk_obras_costos` 
FOREIGN KEY (`cos_id`) 
REFERENCES `centro_costos` (`cos_id`),
ADD CONSTRAINT `fk_obras_usuarios` 
FOREIGN KEY (`use_id`) 
REFERENCES `usuarios` (`use_id`);