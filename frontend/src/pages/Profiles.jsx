import React, {useState, useEffect} from 'react'
import {Modal, Table} from 'antd'
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import Nav from '../components/Nav';


const Profiles = () => {

    const [datos, setDatos] = useState([])
    const [per_id, setId] = useState(null)
    const [per_nombre, setPer_nombre] = useState('')
    const [per_estado, setPer_estado] = useState('')
    const [modal_nuevo, setModal_nuevo] = useState('')
    const [modal_editar, setModal_editar] = useState('')
    const [error, setError] = useState(null)
    const columns = [
        {
          title: 'Nombre',
          dataIndex: 'nombre',
          sorter: (a, b) => a.nombre.length - b.nombre.length,
          sortDirections: ['descend'],
        },
        {
          title: 'Estado',
          dataIndex: 'estado',
          filters: [
            {
              text: 'Activo',
              value: 'Activo',
            },
            {
              text: 'Inactivo',
              value: 'Inactivo',
            },
          ],
          filterMultiple: true,
          onFilter: (value, record) => record.estado.indexOf(value) === 0
        },
        {
            title: 'Editar',
            dataIndex: 'editar',
        },
        {
            title: 'Eliminar',
            dataIndex: 'eliminar',
            
        }
    ];

    useEffect(() => {
        
            fetch("/perfiles", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                per_nombre: per_nombre,
                perestado: per_estado
            }),
        })
        .then(response => response.json())
        .then(data => {
            data.map(item =>
                setDatos(datos => [...datos, {
                    key: item.id, 
                    nombre: item.per_nombre, 
                    estado: (
                        item.per_estado === 1 ? "Activo":"Inactivo"
                    ), 
                    editar: (<button
                                onClick={() => {AbrirModal_editar(item.id)}}
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
    }, []);

    const Buscar = () => {
        Reset_per()

        fetch("/perfiles", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            per_nombre: per_nombre,
            perestado: per_estado
        }),
        })
        .then(response => response.json())
        .then(data => {
            data.map(item =>
                setDatos(datos => [...datos, {
                    key: item.id, 
                    nombre: item.per_nombre, 
                    estado: item.per_estado,
                    editar: (<button
                                onClick={() => {AbrirModal_editar(item.id)}}
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
    }

    const AbrirModal_nuevo = () => {
        setModal_nuevo(true)
    }

    const CerrarModal_nuevo = () => {
        setModal_nuevo(false)
    }

    const Accion_nuevo = () => {

        if (per_nombre === '') {
            setError('Ingresa un nombre')
        } else if (per_estado === '') {
            setError('Ingresa un estado')
        } else {
            fetch("/registrar_perfil", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                per_nombre: per_nombre,
                per_estado: per_estado
            }),
            }).then((res) => {
                if (res.status === 200) {
                CerrarModal_nuevo()
                window.location.href = '/profiles'
            } else {setError('Error en el servidor contacta al administrador')}
            });
        }
    }

    const AbrirModal_editar = async(id) => {
        setModal_editar(true)
        const res = await fetch(`/get_perfil?` + new URLSearchParams({ id: id}))
        const data = await res.json()
        setPer_nombre(data[0].per_nombre)
        setPer_estado(data[0].per_estado)
        setId(id)
        
    }

    const CerrarModal_editar = () => {
        setModal_editar(false)
    }

    const Accion_editar = () => {

        if (per_nombre === '') {
            setError('Ingresa un nombre')
        } else if (per_estado === '') {
            setError('Ingresa un aestado')
        } else {
            fetch("/editar_perfil", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                per_nombre: per_nombre,
                per_estado: per_estado,
                per_id: per_id
            }),
            }).then((res) => {
                if (res.status === 200) {
                CerrarModal_editar()
                window.location.href = '/profiles'
            } else {setError('Error en el servidor contacta al administrador')}
            });
        }
    }

    const Eliminar = (id) => {

        fetch('/eliminar_perfil' , {
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

    const Reset_per = () => {
        setDatos([])
        setId(null)
        setPer_nombre('')
        setPer_estado('')
        setModal_nuevo('')
        setModal_editar('')
        setError(null)
    }

    return (
        <div className="wrapper">
            <Modal
                title="Crear Perfil"
                visible={modal_nuevo}
                onOk={Accion_nuevo}
                onCancel={CerrarModal_nuevo}
                centered
            >
                <form id="form" onSubmit="" className="form-group">
                    <div className="row form-group">
                        <label htmlFor="nombre" className="col-md-3 col-form-label">Nombre</label>
                        <div className="col-md-9"><input
                            onChange={(e)=>{setPer_nombre(e.target.value)}}
                            type="text"
                            name="nombre" 
                            className="ant-input"
                        /></div>
                    </div>
                    <div className="row form-group">
                        <label htmlFor="activo"  className="col-md-3 col-form-label">Activo</label>
                        <div className="col-md-9">
                            <select onChange={(e)=>{setPer_estado(e.target.value)}} name="activo" className="ant-input" allowClear>
                                <option value="">-----------</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
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
                title="Editar Perfil"
                visible={modal_editar}
                onOk={Accion_editar}
                onCancel={CerrarModal_editar}
                centered
            >
                <form id="form" onSubmit="" className="form-group">
                    <div className="row form-group">
                        <label htmlFor="nombre" className="col-md-3 col-form-label">Nombre</label>
                        <div className="col-md-9"><input
                            onChange={(e)=>{setPer_nombre(e.target.value)}}
                            value={per_nombre}
                            type="text"
                            name="nombre" 
                            className="ant-input"
                        /></div>
                    </div>
                    <div className="row form-group">
                        <label htmlFor="activo"  className="col-md-3 col-form-label">Activo</label>
                        <div className="col-md-9">
                            <select value={per_estado} onChange={(e)=>{setPer_estado(e.target.value)}} name="activo" className="ant-input" allowClear>
                                <option value="">-----------</option>
                                <option value="1">Activo</option>
                                <option value="0">Inactivo</option>
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
                                    <input onChange={(e)=>{setPer_nombre(e.target.value)}} name="nombre" type="text"  className="ant-input"/>
                                </div>
                                <div className="col-md-3">
                                    <label htmlFor="estado">Estado: </label>
                                    <select onChange={(e)=>{setPer_estado(e.target.value)}} name="activo" className="ant-input" allowClear>
                                        <option value="">-----------</option>
                                        <option value="1">Activo</option>
                                        <option value="0">Inactivo</option>
                                    </select>
                                </div>
                                <div className="col-md-1"><br/>
                                    <button onClick={Buscar} className="btn btn-primary">Buscar</button>
                                </div>
                                <div className="col-md-1"><br/>
                                    <button onClick={AbrirModal_nuevo} className="btn btn-success">Nuevo</button>
                                </div>
                        </div>
                        <div className="row" >
                    <div className="col-md-12">
                        <Table className="table table-striped table-bordered mt-5" columns={columns} dataSource={datos}/>
                    </div>
                </div>
                    </div>
                </section>
            </div>
            <Footer></Footer>

        </div>
    )
};

export default Profiles; 