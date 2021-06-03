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

class Horas extends Component {
    validator = new SimpleReactValidator({ locale:'custom'});

    state = {
        datos: [],
        hor_id: null,
        hor_nombre: '',
        hor_codigo: '',
        hor_porcentaje: '',
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
                title: 'Porcentaje',
                dataIndex: 'porcentaje',
            },
            {
                title: 'Act por',
                dataIndex: 'hor_usu_act'
            },
            {
                title: 'Fecha act',
                dataIndex: 'hor_fecha_act'
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
        fetch("/horas", {
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
                        key: item.hor_id, 
                        nombre: item.hor_nombre, 
                        codigo: item.hor_codigo,
                        porcentaje: `${item.hor_porcentaje} %`,
                        hor_usu_act: item.hor_usu_act,
                        hor_fecha_act: item.hor_fecha_act ? item.hor_fecha_act.slice(0, -14) : '',
                        editar: (<button
                                    onClick={()=>{this.AbrirModal_editar(item.hor_id)}}
                                    className="btn btn-primary"
                                >
                                    Editar
                                </button>),
                        eliminar: (<button
                                    className="btn btn-danger"
                                    onClick={()=>{this.Eliminar(item.hor_id)}}
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
        this.Reset_horas()
    }

    CerrarModal_nuevo = () => {
        this.setState({modal_nuevo: false})
    }

    Accion_nuevo = () => {
        if (this.validator.allValid()) {
            fetch("/registrar_hora", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hor_nombre: this.state.hor_nombre,
                hor_codigo: this.state.hor_codigo,
                hor_porcentaje: this.state.hor_porcentaje,
                hor_usu_act: localStorage.getItem("usuario"),
                hor_fecha_act: Moment().format('YYYY-MM-DD HH:mm')
            }),
            }).then((res) => {
                if (res.status === 200) {
                    this.CerrarModal_nuevo()
                    window.location.href = '/horas'
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
        const res = await fetch(`/get_horas?` + new URLSearchParams({ id: id}))
        const data = await res.json()
        console.log(data)
        this.setState({
                hor_nombre: data[0].hor_nombre,
                hor_codigo: data[0].hor_codigo,
                hor_porcentaje: data[0].hor_porcentaje,
                hor_id: id
            })
    }

    CerrarModal_editar = () => {
        this.setState({modal_editar: false})
    }

    Accion_editar = () => {
        if (this.validator.allValid()) {
            fetch("/editar_hora", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                hor_nombre: this.state.hor_nombre,
                hor_codigo: this.state.hor_codigo,
                hor_porcentaje: this.state.hor_porcentaje,
                hor_usu_act: localStorage.getItem("usuario"),
                hor_fecha_act: Moment().format('YYYY-MM-DD HH:mm'),
                id: this.state.hor_id
            }),
            }).then((res) => {
               
                if (res.status === 200) {
                    this.CerrarModal_editar()
                    window.location.href = '/horas'
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

        fetch('/eliminar_hora' , {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           id: id
           })
       })
       window.location.href = '/horas'
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    Reset_horas = () => {
        this.setState({
            hor_id: null,
            hor_nombre: '',
            hor_codigo: '',
            hor_porcentaje: ''
        })
    }

    render () {
        return (
            <div className="wrapper col-md-12">
                <Modal
                    title="Crear Hora"
                    visible={this.state.modal_nuevo}
                    onOk={this.Accion_nuevo.bind(this)}
                    onCancel={this.CerrarModal_nuevo.bind(this)}
                    centered
                >
                    <form id="form" onSubmit="" className="form-group">
                        <div className="row form-group">
                            <label htmlFor="hor_nombre" className="col-md-3 col-form-label">Nombre</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                type="text"
                                name="hor_nombre" 
                                className="ant-input"
                            />
                            {this.validator.message('nombre', this.state.hor_nombre, 'required|max:50|min:3', { className: 'text-danger' })}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label htmlFor="hor_codigo" className="col-md-3 col-form-label">Codigo</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                type="number"
                                name="hor_codigo" 
                                className="ant-input"
                            />
                            {this.validator.message('codigo', this.state.hor_codigo, 'required|numeric|min:0,num|max:10|min:5', { className: 'text-danger' })}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label htmlFor="hor_porcentaje" className="col-md-3 col-form-label">Porcentaje</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                type="number"
                                name="hor_porcentaje" 
                                className="ant-input"
                            />
                            {this.validator.message('porcentaje', this.state.hor_porcentaje, 'required|numeric|min:0,num|max:100,num', { className: 'text-danger' })}
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
                    title="Editar Hora"
                    visible={this.state.modal_editar}
                    onOk={this.Accion_editar.bind(this)}
                    onCancel={this.CerrarModal_editar.bind(this)}
                    centered
                >
                    <form id="form" onSubmit="" className="form-group">
                        <div className="row form-group">
                            <label htmlFor="hor_nombre" className="col-md-3 col-form-label">Nombre</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                value={this.state.hor_nombre}
                                type="text"
                                name="hor_nombre" 
                                className="ant-input"
                            />
                            {this.validator.message('nombre', this.state.hor_nombre, 'required|max:50|min:3', { className: 'text-danger' })}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label htmlFor="hor_codigo" className="col-md-3 col-form-label">Codigo</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                value={this.state.hor_codigo}
                                type="number"
                                name="hor_codigo" 
                                className="ant-input"
                            />
                            {this.validator.message('codigo', this.state.hor_codigo, 'required|numeric|min:0,num|max:10|min:5', { className: 'text-danger' })}
                            </div>
                        </div>
                        <div className="row form-group">
                            <label htmlFor="hor_porcentaje" className="col-md-3 col-form-label">Porcentaje</label>
                            <div className="col-md-9"><input
                                onChange={this.onChange.bind(this)}
                                value={this.state.hor_porcentaje}
                                type="number"
                                name="hor_porcentaje" 
                                className="ant-input"
                            />
                            {this.validator.message('porcentaje', this.state.hor_porcentaje, 'required|numeric|min:0,num|max:100,num', { className: 'text-danger' })}
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

export default Horas