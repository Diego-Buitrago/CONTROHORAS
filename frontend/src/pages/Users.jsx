import React, {useState, useEffect} from 'react'
//import {Modal} from 'antd'
import {Modal} from 'antd'

const Usuarios = () => {

    const [datos, setDatos] = useState([{}])
    const [use_id, setId] = useState(0)
    const [use_nombre, setUse_Nombre] = useState('')
    const [use_apellido, setUse_Apellido] = useState('')
    const [use_documento, setUse_Documento] = useState('')
    const [use_correo, setUse_correo] = useState('')
    const [use_contrasena, setUse_contrasena] = useState('')
    const [conf_use_contrasena, setConf_se_contrasena] = useState('')
    const [use_tipo, setUse_tipo] = useState('')
    const [modal, setModal] = useState(false)
    const [modalEdid, setModalEdid] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        
            fetch("/usuarios", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                use_nombre: use_nombre,
                use_apellido: use_apellido,
                use_documento: use_documento
            }),
        })
        .then(response => response.json())
        .then(data => setDatos(data));   
    }, []);
    console.log(datos)

    const Buscar = () => {

        fetch("/usuarios", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            use_nombre: use_nombre,
            use_apellido: use_apellido,
            use_documento: use_documento
        }),
        })
        .then(response => response.json())
        .then(data => data === 'usuario no encontrado verifica datos' ? '' : setDatos(data))
    }

    const Nuevo = () => {
        setModal(true)
    }

    const CerrarModal = () => {
        setModal(false)
    }

    const Accion = () => {

        if (use_nombre === '') {
            setError('Ingresa un nombre')
        } else if (use_apellido === '') {
            setError('Ingresa un apellido')
        } else if (use_documento === '') {
            setError('Ingresa una documento')
        } else if (use_correo == '') {
            setError('Ingresa un correo')
        } else if (use_contrasena === '') {
            setError('Ingresa una contraseña')
        } else if (use_contrasena !== conf_use_contrasena) {
            setError('La contraseña no coincide')
        } else if (use_tipo === '') {
            setError('Selecciona el tipo de usuario')
        } else {
            fetch("/registrar_usuario", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                use_nombre: use_nombre,
                use_apellido: use_apellido,
                use_documento: use_documento,
                use_correo: use_correo,
                use_contrasena: use_contrasena,
                use_tipo: use_tipo
            }),
            }).then((res) => {
                if (res.status === 200) {
                setError(null)
                CerrarModal()
            } else {setError('Error en el servidor contacta al administrador')}
            });
        }
    }

    const Editar = async(id) => {
        setModalEdid(true)
        const res = await fetch(`/get_editar?` + new URLSearchParams({ id: id}))
        const data = await res.json()
        setUse_Nombre(data[0].use_nombre)
        setUse_Apellido(data[0].use_apellido)
        setUse_Documento(data[0].use_documento)
        setUse_correo(data[0].use_correo)
        setUse_tipo(data[0].use_tipo)
        setId(id)
    }

    const CerrarModalEdid = () => {
        setModalEdid(false)
    }

    const AccionEdid = () => {
        if (use_nombre === '') {
            setError('Ingresa un nombre')
        } else if (use_apellido === '') {
            setError('Ingresa un apellido')
        } else if (use_documento === '') {
            setError('Ingresa una documento')
        } else if (use_correo == '') {
            setError('Ingresa un correo')
        } else if (use_tipo === '') {
            setError('Selecciona el tipo de usuario')
        } else {
            fetch("/editar_usuario", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                use_nombre: use_nombre,
                use_apellido: use_apellido,
                use_documento: use_documento,
                use_correo: use_correo,
                use_contrasena: use_contrasena,
                use_tipo: use_tipo,
                use_id: use_id
            }),
            }).then((res) => {
                if (res.status === 200) {
                setError(null)
                Reset_user()
                CerrarModalEdid()
                Buscar()
            } else {setError('Error en el servidor contacta al administrador')}
            });
        }
    }

    const Eliminar = (id) => {
        const nuevoArray = datos.filter(item => item.id !== id)
        setDatos(nuevoArray)

        fetch('/eliminar_usuario' , {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           id: id
           })
       })
    }

    const Reset_user = () => {
        setUse_Nombre('')
        setUse_Apellido('')
        setUse_Documento('')
        setUse_correo('')
        setUse_tipo('')
        setId('')
    }

    return (
        <>
            <Modal
                title="Crear Usuario"
                visible={modal}
                onOk={Accion}
                onCancel={CerrarModal}
                centered
            >
                <form id="form" onSubmit="" className="form-group">
                    <div className="row form-group">
                        <label htmlFor="nombre" className="col-md-3 col-form-label">Nombre</label>
                        <div class="col-md-9"><input
                            onChange={(e)=>{setUse_Nombre(e.target.value)}}
                            type="text"
                            name="use_nombre" 
                            className="ant-input"
                        /></div>
                    </div>
                    <div className="row form-group">
                        <label htmlFor="apellido" className="col-md-3 col-form-label">Apellido</label>
                        <div class="col-md-9"><input
                           onChange={(e)=>{setUse_Apellido(e.target.value)}}
                            type="text"
                            name="use_apellido" 
                            className="ant-input"
                        />
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="documento" className="col-md-3 col-form-label">Documento</label>
                        <div class="col-md-9"><input
                            onChange={(e)=>{setUse_Documento(e.target.value)}}
                            type="text"
                            name="use_documento"
                            className="ant-input"
                        />
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="correo" className="col-md-3 col-form-label">Correo</label>
                        <div class="col-md-9"><input
                            onChange={(e)=>{setUse_correo(e.target.value)}}
                            type="email"
                            name="use_correo"
                            className="ant-input"
                        /></div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="contrasena" className="col-md-3 col-form-label">Contraseña</label>
                        <div class="col-md-9"><input
                            onChange={(e)=>{setUse_contrasena(e.target.value)}}
                            type="password"
                            name="use_contrasena"
                            className="ant-input"
                        /></div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="conf_contrasena" className="col-md-3 col-form-label">Contraseña</label>
                        <div class="col-md-9"><input
                            onChange={(e)=>{setConf_se_contrasena(e.target.value)}}
                            type="password"
                            name="conf_use_contrasena"
                            className="ant-input"
                        /></div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="tipo" className="col-md-3 col-form-label">Tipo de usuario</label>
                        <div class="col-md-9">
                            <select onChange={(e)=>{setUse_tipo(e.target.value)}} name="use_tipo" className="ant-input" allowClear>
                                <option>Escoge tu tipo de usuario</option>
                                <option value="1">Administrador</option>
                                <option value="2">Gestion vehiculos</option>
                                <option value="3">Reparacion vehiculos</option>
                            </select>
                        </div>       
                    </div>
                    {
                        error != null ? (
                            <div id="error" className="alert alert-danger mt-2">{error}</div>
                        ):
                        (
                            <div></div>
                        )
                    }
                </form>
            </Modal>
            <Modal
                title="Editar Usuario"
                visible={modalEdid}
                onOk={AccionEdid}
                onCancel={CerrarModalEdid}
                centered
            >
                <form id="form" onSubmit="" className="form-group">
                    <div className="row form-group">
                        <label htmlFor="nombre" className="col-md-3 col-form-label">Nombre</label>
                        <div class="col-md-9"><input
                            onChange={(e)=>{setUse_Nombre(e.target.value)}}
                            value={use_nombre}
                            type="text"
                            name="use_nombre" 
                            className="ant-input"
                        /></div>
                    </div>
                    <div className="row form-group">
                        <label htmlFor="apellido" className="col-md-3 col-form-label">Apellido</label>
                        <div class="col-md-9"><input
                           onChange={(e)=>{setUse_Apellido(e.target.value)}}
                           value={use_apellido}
                            type="text"
                            name="use_apellido" 
                            className="ant-input"
                        />
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="documento" className="col-md-3 col-form-label">Documento</label>
                        <div class="col-md-9"><input
                            onChange={(e)=>{setUse_Documento(e.target.value)}}
                            value={use_documento}
                            type="text"
                            name="use_documento"
                            className="ant-input"
                        />
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="correo" className="col-md-3 col-form-label">Correo</label>
                        <div class="col-md-9"><input
                            onChange={(e)=>{setUse_correo(e.target.value)}}
                            value={use_correo}
                            type="email"
                            name="use_correo"
                            className="ant-input"
                        /></div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="tipo"  className="col-md-3 col-form-label">Tipo de usuario</label>
                        <div class="col-md-9">
                            <select value={use_tipo} onChange={(e)=>{setUse_tipo(e.target.value)}} name="use_tipo" className="ant-input" allowClear>
                                <option>Escoge tu tipo de usuario</option>
                                <option value="1">Administrador</option>
                                <option value="2">Gestion vehiculos</option>
                                <option value="3">Reparacion vehiculos</option>
                            </select>
                        </div>       
                    </div>
                    {
                        error != null ? (
                            <div id="error" className="alert alert-danger mt-2">{error}</div>
                        ):
                        (
                            <div></div>
                        )
                    }
                </form>
            </Modal>
            <div>
                <table className="table table-striped table-bordered mt-3">
                    <td><label htmlFor="nombre">Nombre: </label></td>
                    <td><input onChange={(e)=>{setUse_Nombre(e.target.value)}} name="nombre" type="text"/></td>
                    <td><label htmlFor="apellido">Apellido: </label></td>
                    <td><input onChange={(e)=>{setUse_Apellido(e.target.value)}} name="apellido" type="text"/></td>
                    <td><label htmlFor="documento">Documento: </label></td>
                    <td><input onChange={(e)=>{setUse_Documento(e.target.value)}} name="documento" type="number"/></td>
                    <td><button onClick={Buscar} className="btn btn-success">Buscar</button></td>
                    <td><button onClick={Nuevo} className="btn btn-success">Nuevo</button></td>
                </table>
            </div>
            <div className=" table-responsive" >
                <table className="table table-striped table-bordered mt-5" id="table-usuarios">
                <tbody>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Documento</th>
                        <th>correo</th>
                        <th>Tipo</th>
                    </tr>
                    {
                        datos.map((item, index) => 
                        <tr key={index}>
                            <td>{item.use_nombre}</td>
                            <td>{item.use_apellido}</td>
                            <td>{item.use_documento}</td>
                            <td>{item.use_correo}</td>
                            <td>{item.use_tipo === 1 ? 'Administrador' : item.use_tipo === 2 ? 'Gestion Vehiculos' : 'Reparacion vehiculos'}</td>
                            <td><button
                                    className="btn btn-info"
                                    onClick={() => {Editar(item.id)}}
                                >
                                    Editar
                                </button></td>
                            <td><button
                                    className="btn btn-danger"
                                    onClick={()=>{Eliminar(item.id)}}
                                >
                                    Eliminar
                                </button></td>
                        </tr>
                    )
                    }
                </tbody>
                </table>
            </div>
        </>
    )
};

export default Usuarios; 