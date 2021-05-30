CREATE DATABASE control_vehiculos;

ALTER TABLE seguimiento DROP CONSTRAINT fK_seguimiento_motocicletas;

DROP insert_segumiento ON motocicletas;

DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS motocicletas;
DROP TABLE IF EXISTS seguimiento;
DROP TABLE IF EXISTS veihiculos_eliminados;
DROP TABLE IF EXISTS perfiles;

CREATE TABLE usuarios(
    id SERIAL PRIMARY KEY,
    use_nombre VARCHAR(50) NOT NULL,
    use_apellido VARCHAR(50) NOT NULL,
    use_documento VARCHAR(50) NOT NULL UNIQUE, 
    use_correo VARCHAR(50) NOT NULL UNIQUE,
    use_contrasena VARCHAR(100) NOT NULL,
    use_tipo INTEGER NOT NULL,
    use_estado INTEGER DEFAULT 1
);

CREATE TABLE perfiles(
    id SERIAL PRIMARY KEY,
    per_nombre VARCHAR(50) NOT NULL UNIQUE,
    per_estado INTEGER NOT NULL
);

CREATE TABLE motocicletas(
    nro_placa VARCHAR(20) PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    linea VARCHAR(50) NOT NULL,
    modelo INTEGER NOT NULL,
    fecha_ven_seguro DATE NOT NULL,
    fecha_ven_tecnomecanica DATE,
    seguimiento BOOLEAN DEFAULT false
);

CREATE TABLE seguimiento(
    id SERIAL PRIMARY KEY,
    placa_moto VARCHAR(50) NOT NULL,
    marca VARCHAR(50)  NOT NULL,
    linea VARCHAR(50) NOT NULL,
    fecha_reparacion DATE NOT NULL,
    tipo_seguimiento VARCHAR(50) NOT NULL,
    observaciones VARCHAR(200)
);

CREATE TABLE veihiculos_eliminados(
    nro_placa VARCHAR(20) PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    linea VARCHAR(50) NOT NULL,
    modelo INTEGER NOT NULL
);

-- crear disparador o trigger
create function vehiculos_seguimiento() returns trigger
as
$$
begin

	update motocicletas set seguimiento = true where nro_placa = new.placa_moto;

return new;
end
$$
language plpgsql;

create trigger insert_segumiento after insert on seguimiento
for each row 
execute procedure vehiculos_seguimiento();