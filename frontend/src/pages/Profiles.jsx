import React, {Component} from 'react';
import { withRouter } from 'react-router-dom';
import {Modal, Table} from 'antd';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import Nav from '../components/Nav';
import SimpleReactValidator from 'simple-react-validator'
SimpleReactValidator.addLocale('custom', {
    accepted: 'Hab SoSlI’ Quch!',
    required: 'El campo :attribute es obligatorio.',
});

class Profiles extends Component {

    validator = new SimpleReactValidator({ locale:'custom'});

    state = {
        datos: [],
        per_id: null,
        per_nombre: '',
        per_estado: '',
        modal_nuevo: false,
        modal_editar: false,
        top: 'topLeft',
        bottom: 'bottomRight',
        error: null,
        columns: [
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
        ]
    }

    async componentDidMount() {
        fetch("/perfiles", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            per_nombre: this.state.per_nombre,
            per_estado: this.state.per_estado
        }),
        })
        .then(response => response.json())
        .then(data => {
            const array = []
            if (data !== 'usuario no encontrado verifica datos') {
                data.map(item =>
                    array.push({
                        key: item.id, 
                        nombre: item.per_nombre, 
                        estado: (item.per_estado===1)?'Activo':'Inactivo',
                        editar: (<button
                                    onClick={()=>{this.AbrirModal_editar(item.id)}}
                                    className="btn btn-primary"
                                >
                                    Editar
                                </button>),
                        eliminar: (<button
                                    className="btn btn-danger"
                                    onClick={()=>{this.Eliminar(item.id)}}
                                >
                                    Eliminar
                                </button>)
                    })
                )
            }
            this.setState({datos: array})
        });
    }

    AbrirModal_nuevo = () => {
        this.setState({modal_nuevo: true})
        this.setState({per_nombre: ''})
        this.setState({per_estado: 1})
    }

    CerrarModal_nuevo = () => {
        this.setState({modal_nuevo: false})
    }

    Accion_nuevo = () => {
        if (this.validator.allValid()) {
            fetch("/registrar_perfil", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                per_nombre: this.state.per_nombre,
                per_estado: this.state.per_estado
            }),
            }).then((res) => {
                if (res.status === 200) {
                    this.CerrarModal_nuevo()
                    window.location.href = '/profiles'
                } else if (res.status === 501) {
                    console.log(res)
                    this.setState({error : 'Nombre duplicado'})
                }  else {
                    this.setState({error : 'Error en el servidor contacta al administrador'})
                }
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    AbrirModal_editar = async(id) => {
        this.setState({modal_editar: true})
        const res = await fetch(`/get_perfil?` + new URLSearchParams({ id: id}))
        const data = await res.json()
        this.setState({
            per_nombre: data[0].per_nombre,
            per_estado: data[0].per_estado,
            per_id: id
        })
    }

    CerrarModal_editar = () => {
        this.setState({modal_editar: false})
    }

    Accion_editar = () => {
        if (this.validator.allValid()) {
            fetch("/editar_perfil", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                per_nombre: this.state.per_nombre,
                per_estado: this.state.per_estado,
                per_id: this.state.per_id
            }),
            }).then((res) => {
               
                if (res.status === 200) {
                    this.CerrarModal_editar()
                    window.location.href = '/profiles'
                } else if (res.status === 501) {
                    console.log(res)
                    this.setState({error : 'Nombre duplicado'})
                } else {
                    this.setState({error : 'Error en el servidor contacta al administrador'})
                }
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    Eliminar = (id) => {

        fetch('/eliminar_perfil' , {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           id: id
           })
       })
       window.location.href = '/profiles'
    }

    Reset_per = () => {
        this.setState({
            datos: [],
            per_id: '',
            per_nombre: '',
            per_estado: '',
            modal_nuevo: false,
            setModal_editar: false,
            error: null
        })
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    } 

    render () {
        return (
            <div className="wrapper">
                <Modal
                    title="Crear Perfil"
                    visible={this.state.modal_nuevo}
                    onOk={this.Accion_nuevo.bind(this)}
                    onCancel={this.CerrarModal_nuevo.bind(this)}
                    centered
                >
                    <form id="form" onSubmit="" className="form-group">
                        <div className="row form-group">
                            <label htmlFor="per_nombre" className="col-md-3 col-form-label">Nombre</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                type="text"
                                name="per_nombre" 
                                className="ant-input"
                            />
                            {this.validator.message('nombre', this.state.per_nombre, 'required|alpha', { className: 'text-danger' })}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label htmlFor="per_nombre"  className="col-md-3 col-form-label">Activo</label>
                            <div className="col-md-9">
                                <select onChange={this.onChange.bind(this)} name="per_estado" className="ant-input" allowClear>
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                                {this.validator.message('estado', this.state.per_estado, 'required',  { className: 'text-danger' })}
                            </div>    
                        </div>
                        {
                            this.state.error != null ? (
                                <div id="error" className="alert alert-danger mt-2">{this.state.error}</div>
                            ):
                            (
                                <div></div>
                            )   
                        }
                    </form>
                </Modal>
                <Modal
                    title="Editar Perfil"
                    visible={this.state.modal_editar}
                    onOk={this.Accion_editar.bind(this)}
                    onCancel={this.CerrarModal_editar.bind(this)}
                    centered
                >
                    <form id="form" onSubmit="" className="form-group">
                        <div className="row form-group">
                            <label htmlFor="per_nombre" className="col-md-3 col-form-label">Nombre</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                value={this.state.per_nombre}
                                type="text"
                                name="per_nombre" 
                                className="ant-input"
                            />
                            {this.validator.message('nombre', this.state.per_nombre, 'required|alpha', { className: 'text-danger' })}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label htmlFor="per_nombre"  className="col-md-3 col-form-label">Activo</label>
                            <div className="col-md-9">
                                <select value={this.state.per_estado} onChange={this.onChange.bind(this)} name="per_estado" className="ant-input" allowClear>
                                    <option value="1">Activo</option>
                                    <option value="0">Inactivo</option>
                                </select>
                                {this.validator.message('estado', this.state.per_estado, 'required',  { className: 'text-danger' })}
                            </div>  
                        </div>
                        {
                            this.state.error != null ? (
                                <div id="error" className="alert alert-danger mt-2">{this.state.error}</div>
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
                            <div className="row justify-content-end">
                                    <div className="col-md-1"><br/>
                                        <button onClick={this.AbrirModal_nuevo.bind(this)} className="btn btn-success">Nuevo</button>
                                    </div>
                            </div>
                            <div className="row" >
                        <div className="col-md-12">
                            <Table className="table table-striped table-bordered mt-5" columns={this.state.columns} dataSource={this.state.datos} pagination={{ position: [this.state.bottom],pageSize:5 }}/>
                        </div>
                    </div>
                        </div>
                    </section>
                </div>
                <Footer></Footer>
    
            </div>
        )
    }
} 

export default withRouter(Profiles);