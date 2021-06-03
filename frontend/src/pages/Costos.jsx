import React, {Component} from 'react';
import {Modal, Table} from 'antd';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import Nav from '../components/Nav';
import SimpleReactValidator from 'simple-react-validator'
import Moment from 'moment';
SimpleReactValidator.addLocale('custom', {
    accepted: 'Hab SoSlI’ Quch!',
    required: 'El campo :attribute es obligatorio.',
    max: ':attribute no debe ser mayor a :max:type.',
    min: 'El tamaño de :attribute debe ser de al menos :min:type.',
    alpha: ':attribute sólo debe contener letras.'
});

class Costos extends Component {
    validator = new SimpleReactValidator({ locale:'custom'});

    state = {
        datos: [],
        cos_id: null,
        cos_nombre: '',
        cos_codigo: '',
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
                title: 'Codigo',
                dataIndex: 'codigo',
            },
            {
                title: 'Act por',
                dataIndex: 'cos_usu_act'
            },
            {
                title: 'Fecha act',
                dataIndex: 'cos_fecha_act'
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
        fetch("/costos", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            //parametros
        }),
        })
        .then(response => response.json())
        .then(data => {
            const array = []
            if (data !== 'usuario no encontrado verifica datos') {
                data.map(item =>
                    array.push({
                        key: item.cos_id, 
                        nombre: item.cos_nombre, 
                        codigo: item.cos_codigo,
                        cos_usu_act: item.cos_usu_act,
                        cos_fecha_act: item.cos_fecha_act,
                        editar: (<button
                                    onClick={()=>{this.AbrirModal_editar(item.cos_id)}}
                                    className="btn btn-primary"
                                >
                                    Editar
                                </button>),
                        eliminar: (<button
                                    className="btn btn-danger"
                                    onClick={()=>{this.Eliminar(item.cos_id)}}
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
        this.Reset_costos()
    }

    CerrarModal_nuevo = () => {
        this.setState({modal_nuevo: false})
    }

    Accion_nuevo = () => {
        if (this.validator.allValid()) {
            fetch("/registrar_costo", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cos_nombre: this.state.cos_nombre,
                cos_codigo: this.state.cos_codigo,
                cos_usu_act: localStorage.getItem("usuario"),
                cos_fecha_act: Moment().format('YYYY-MM-DD HH:mm')
            }),
            }).then((res) => {
                if (res.status === 200) {
                    this.CerrarModal_nuevo()
                    window.location.href = '/costos'
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
        const res = await fetch(`/get_costos?` + new URLSearchParams({ id: id}))
        const data = await res.json()
        this.setState({
                cos_nombre: data[0].cos_nombre,
                cos_codigo: data[0].cos_codigo,
                cos_id: id
            })
    }

    CerrarModal_editar = () => {
        this.setState({modal_editar: false})
    }

    Accion_editar = () => {
        if (this.validator.allValid()) {
            fetch("/editar_costo", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                cos_nombre: this.state.cos_nombre,
                cos_codigo: this.state.cos_codigo,
                cos_usu_act: localStorage.getItem("usuario"),
                cos_fecha_act: Moment().format('YYYY-MM-DD HH:mm'),
                id: this.state.cos_id
            }),
            }).then((res) => {
               
                if (res.status === 200) {
                    this.CerrarModal_editar()
                    window.location.href = '/costos'
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

        fetch('/eliminar_costo' , {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           id: id
           })
       })
       window.location.href = '/costos'
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    Reset_costos = () => {
        this.setState({
            cos_id: null,
            cos_nombre: '',
            cos_codigo: '',
        })
    }


    render () {
        return (
            <div className="wrapper col-md-12">
                <Modal
                    title="Crear Centro de costos"
                    visible={this.state.modal_nuevo}
                    onOk={this.Accion_nuevo.bind(this)}
                    onCancel={this.CerrarModal_nuevo.bind(this)}
                    centered
                >
                    <form id="form" onSubmit="" className="form-group">
                        <div className="row form-group">
                            <label htmlFor="cos_nombre" className="col-md-3 col-form-label">Nombre</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                type="text"
                                name="cos_nombre" 
                                className="ant-input"
                            />
                            {this.validator.message('nombre', this.state.cos_nombre, 'required|max:50|min:3', { className: 'text-danger' })}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label htmlFor="cos_codigo" className="col-md-3 col-form-label">Codigo</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                type="number"
                                name="cos_codigo" 
                                className="ant-input"
                            />
                            {this.validator.message('codigo', this.state.cos_codigo, 'required|numeric|min:0,num|max:10|min:5', { className: 'text-danger' })}
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
                    title="Editar Centro de costos"
                    visible={this.state.modal_editar}
                    onOk={this.Accion_editar.bind(this)}
                    onCancel={this.CerrarModal_editar.bind(this)}
                    centered
                >
                    <form id="form" onSubmit="" className="form-group">
                        <div className="row form-group">
                            <label htmlFor="cos_nombre" className="col-md-3 col-form-label">Nombre</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                value={this.state.cos_nombre}
                                type="text"
                                name="cos_nombre" 
                                className="ant-input"
                            />
                          {this.validator.message('nombre', this.state.cos_nombre, 'required|max:50|min:3', { className: 'text-danger' })}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label htmlFor="cos_codigo" className="col-md-3 col-form-label">Codigo</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                value={this.state.cos_codigo}
                                type="number"
                                name="cos_codigo" 
                                className="ant-input"
                            />
                           {this.validator.message('codigo', this.state.cos_codigo, 'required|numeric|min:0,num|max:10|min:5', { className: 'text-danger' })}
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

export default Costos