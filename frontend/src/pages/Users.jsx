import React, {useState, useEffect} from 'react'
import {Modal, Table} from 'antd'
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import Nav from '../components/Nav';


const Usuarios = () => {

    const [datos, setDatos] = useState([])
    const [perfiles, setPerfiles] = useState([{}])
    const [use_id, setId] = useState(null)
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
    const columns = [
        {
          title: 'Nombre',
          dataIndex: 'nombre',
          sorter: (a, b) => a.nombre.length - b.nombre.length,
          sortDirections: ['descend'],
        },
        {
          title: 'Apellido',
          dataIndex: 'apellido',
        },
        {
            title: 'Documento',
            dataIndex: 'documento',
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo',
            
        },
        {
            title: 'Editar',
            dataIndex: 'editar',
        },
        {
            title: 'Eliminar',
            dataIndex: 'eliminar',
            
        }
    ]

    useEffect(async() => {
        
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
        .then(data => {
            data.map(item =>
                setDatos(datos => [...datos, {
                    key: item.id, 
                    nombre: item.use_nombre, 
                    apellido: item.use_apellido,
                    documento: item.use_documento, 
                    correo: item.use_correo,
                    tipo: item.use_tipo,
                    editar: (<button
                                onClick={() => {Editar(item.id)}}
                                className="btn btn-primary"
                            >
                                Editar
                            </button>),
                    eliminar: (<button
                                className="btn btn-danger"
                                onClick={() => {Eliminar(item.id)}}
                            >
                                Eliminar
                            </button>)
                }])
            )
        });
        
        const res = await fetch(`/perfiles_actvos?` + new URLSearchParams({ estado: 1}))
        const data = await res.json()
        setPerfiles(data)

    }, []);

    const Buscar = () => {
        Reset_user()
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
        .then(data => {
            data.map(item =>
                setDatos(datos => [...datos, {
                    key: item.id, 
                    nombre: item.use_nombre, 
                    apellido: item.use_apellido,
                    documento: item.use_documento, 
                    correo: item.use_correo,
                    tipo: item.use_tipo,
                    editar: (<button
                                onClick={() => {Editar(item.id)}}
                                className="btn btn-primary col-md-1"
                            >
                                Editar
                            </button>),
                    eliminar: (<button
                                className="btn btn-danger col-md-1"
                                onClick={() => {Eliminar(item.id)}}
                            >
                                Eliminar
                            </button>)
                }])
            )
        });
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
                window.location.href = '/users'
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
                Reset_user()
                CerrarModalEdid()
                window.location.href = '/users'
            } else {setError('Error en el servidor contacta al administrador')}
            });
        }
    }

    const Eliminar = (id) => {

        fetch('/eliminar_usuario' , {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           id: id
           })
       })
       Buscar()
    }

    const Reset_user = () => {
        setDatos([])
        setUse_Nombre('')
        setUse_Apellido('')
        setUse_Documento('')
        setUse_correo('')
        setUse_tipo('')
        setId('')
        setError(null)
    }

    return (
        <div className="wrapper">
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
                        <div className="col-md-9"><input
                            onChange={(e)=>{setUse_Nombre(e.target.value)}}
                            type="text"
                            name="use_nombre" 
                            className="ant-input"
                        /></div>
                    </div>
                    <div className="row form-group">
                        <label htmlFor="apellido" className="col-md-3 col-form-label">Apellido</label>
                        <div className="col-md-9"><input
                           onChange={(e)=>{setUse_Apellido(e.target.value)}}
                            type="text"
                            name="use_apellido" 
                            className="ant-input"
                        />
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="documento" className="col-md-3 col-form-label">Documento</label>
                        <div className="col-md-9"><input
                            onChange={(e)=>{setUse_Documento(e.target.value)}}
                            type="text"
                            name="use_documento"
                            className="ant-input"
                        />
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="correo" className="col-md-3 col-form-label">Correo</label>
                        <div className="col-md-9"><input
                            onChange={(e)=>{setUse_correo(e.target.value)}}
                            type="email"
                            name="use_correo"
                            className="ant-input"
                        /></div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="contrasena" className="col-md-3 col-form-label">Contraseña</label>
                        <div className="col-md-9"><input
                            onChange={(e)=>{setUse_contrasena(e.target.value)}}
                            type="password"
                            name="use_contrasena"
                            className="ant-input"
                        /></div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="conf_contrasena" className="col-md-3 col-form-label">Contraseña</label>
                        <div className="col-md-9"><input
                            onChange={(e)=>{setConf_se_contrasena(e.target.value)}}
                            type="password"
                            name="conf_use_contrasena"
                            className="ant-input"
                        /></div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="tipo" className="col-md-3 col-form-label">Tipo de usuario</label>
                        <div className="col-md-9">
                            <select onChange={(e)=>{setUse_tipo(e.target.value)}} name="use_tipo" className="ant-input" allowClear>
                                <option value="">----------------</option>
                                {
                                    perfiles.map(perfil =>
                                        <option value={perfil.id}>{perfil.per_estado === 1 ? perfil.per_nombre : ''}</option>
                                    )
                                }
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
                        <div className="col-md-9"><input
                            onChange={(e)=>{setUse_Nombre(e.target.value)}}
                            value={use_nombre}
                            type="text"
                            name="use_nombre" 
                            className="ant-input"
                        /></div>
                    </div>
                    <div className="row form-group">
                        <label htmlFor="apellido" className="col-md-3 col-form-label">Apellido</label>
                        <div className="col-md-9"><input
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
                        <div className="col-md-9"><input
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
                        <div className="col-md-9"><input
                            onChange={(e)=>{setUse_correo(e.target.value)}}
                            value={use_correo}
                            type="email"
                            name="use_correo"
                            className="ant-input"
                        /></div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="tipo"  className="col-md-3 col-form-label">Tipo de usuario</label>
                        <div className="col-md-9">
                            <select value={use_tipo} onChange={(e)=>{setUse_tipo(e.target.value)}} name="use_tipo" className="ant-input" allowClear>
                                <option value="">----------------</option>
                                {
                                    perfiles.map(perfil =>
                                        <option value={perfil.id}>{perfil.per_estado === 1 ? perfil.per_nombre : ''}</option>
                                    )
                                }
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

          <Nav></Nav>
          <Menu></Menu>
            <div className="content-wrapper">  
                <section className="content">
                    <div className="container-fluid">
                        <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor="nombre">Nombre: </label>
                                    <input onChange={(e)=>{setUse_Nombre(e.target.value)}} name="nombre" type="text"  className="ant-input"/></div>
                                <div className="col-md-3">
                                    <label htmlFor="apellido">Apellido: </label>
                                    <input onChange={(e)=>{setUse_Apellido(e.target.value)}} name="apellido" type="text" className="ant-input"/></div>
                                <div className="col-md-3">
                                    <label htmlFor="documento">Documento: </label>
                                    <input onChange={(e)=>{setUse_Documento(e.target.value)}} name="documento" type="number" className="ant-input"/></div>
                                <div className="col-md-1"><br/>
                                    <button onClick={Buscar} className="btn btn-primary">Buscar</button>
                                </div>
                                <div className="col-md-1"><br/>
                                    <button onClick={Nuevo} className="btn btn-success">Nuevo</button>
                                </div>
                        </div>
                        <div className="row" >
                    <div className="col-md-12">
                        <Table 
                            className="table table-striped table-bordered mt-5" 
                            columns={columns} 
                            dataSource={datos}
                            
                        />
                    </div>
                    
                </div>
                    </div>
                </section>
            </div>
            <Footer></Footer>

        </div>
    )
};

export default Usuarios; 