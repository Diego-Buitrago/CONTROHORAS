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
});

class Obras extends Component {
    validator = new SimpleReactValidator({ locale:'custom'});

    state = {
        datos: [],
        obr_id: null,
        obr_nombre: '',
        obr_val_operador: '',
        obr_val_maquina: '',
        use_id: '',
        obr_horas_mes: '',
        cos_id: '',
        obr_lunes: '',
        obr_martes: '',
        obr_miercoles: '',
        obr_jueves: '',
        obr_viernes: '',
        obr_sabado: '',
        obr_domingo: '',
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
                title: 'Val operador',
                dataIndex: 'val_operador',
            },
            {
                title: 'Val maquina',
                dataIndex: 'val_maquina',
            },
            {
                title: 'Horas mes',
                dataIndex: 'obr_horas_mes',
            },
            {
                title: 'Lunes',
                dataIndex: 'lunes',
            },
            {
                title: 'Martes',
                dataIndex: 'martes',
            },
            {
                title: 'Miercoles',
                dataIndex: 'miercoles',
            },
            {
                title: 'Jueves',
                dataIndex: 'jueves',
            },
            {
                title: 'Vierne',
                dataIndex: 'viernes',
            },
            {
                title: 'Sabado',
                dataIndex: 'sabado',
            },
            {
                title: 'Domingo',
                dataIndex: 'domingo',
            },
            {
                title: 'Act por',
                dataIndex: 'obr_usu_act'
            },
            {
                title: 'Fecha act',
                dataIndex: 'obr_fecha_act'
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

    AbrirModal_nuevo = () => {
        this.setState({modal_nuevo: true})
    }

    CerrarModal_nuevo = () => {
        this.setState({modal_nuevo: false})
    }

    Accion_nuevo = () => {
        if (this.validator.allValid()) {
            fetch("/registrar_obra", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                obr_nombre: this.state.obr_nombre,
                obr_val_operador: this.state.obr_val_operador,
                obr_val_maquina: this.state.obr_val_maquina,
                use_id: this.state.use_id,
                obr_horas_mes: this.state.obr_horas_mes,
                cos_id: this.state.cos_id,
                obr_lunes: this.state.obr_lunes,
                obr_martes: this.state.obr_martes,
                obr_miercoles: this.state.obr_miercoles,
                obr_jueves: this.state.obr_jueves,
                obr_viernes: this.state.obr_viernes,
                obr_sabado: this.state.obr_sabado,
                obr_domingo: this.state.obr_domingo,
                cos_usu_act: 'Diego',
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

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    
    render () {
        return (
            <div className="wrapper">
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
                            {this.validator.message('nombre', this.state.cos_nombre, 'required|alpha', { className: 'text-danger' })}
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
                            {this.validator.message('codigo', this.state.cos_codigo, 'required', { className: 'text-danger' })}
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
                                        <button /* onClick={this.AbrirModal_nuevo.bind(this)} */ className="btn btn-success">Nuevo</button>
                                    </div>
                            </div>
                            <div className="row" >
                        <div className="col-md-12">
                            <Table className="table table-striped table-bordered mt-5" columns={this.state.columns} /* dataSource={this.state.datos} */ pagination={{ position: [this.state.bottom],pageSize:5 }}/>
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

export default Obras