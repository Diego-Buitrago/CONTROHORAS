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

class Obras extends Component {
    validator = new SimpleReactValidator({ locale:'custom'});

    state = {
        datos: [],
        obr_id: null,
        obr_directores: [],
        obr_costos: [],
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

    async componentDidMount() {
        fetch("/obras", {
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
            if (data !== 'obra no encontrada') {
                data.map(item =>
                    array.push({
                        key: item.obr_id, 
                        nombre: item.obr_nombre, 
                        val_operado: item.obr_val_operador,
                        val_maquina: item.obr_val_maquina,
                        obr_horas_mes: item.obr_horas_mes,
                        lunes: item.obr_horas_mes,
                        martes: item.obr_martes,
                        miercoles: item.obr_miercoles,
                        jueves: item.obr_jueves,
                        viernes: item.obr_viernes,
                        sabado: item.obr_sabado,
                        domingo: item.obr_domingo,
                        obr_usu_act: item.obr_usu_act,
                        obr_fecha_act: item.obr_fecha_act,
                        editar: (<button
                                    onClick={()=>{this.AbrirModal_editar(item.obr_id)}}
                                    className="btn btn-primary"
                                >
                                    Editar
                                </button>),
                        eliminar: (<button
                                    className="btn btn-danger"
                                    onClick={()=>{this.Eliminar(item.obr_id)}}
                                >
                                    Eliminar
                                </button>)
                    })
                )
            }
            this.setState({datos: array})
        });

        const res_directores = await fetch(`/get_directores`)
        const data_directores = await res_directores.json()
        this.setState({obr_directores: data_directores})

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
            this.setState({obr_costos: data})
        });
    }

    AbrirModal_nuevo = () => {
        this.setState({modal_nuevo: true})
        this.Reset_obras()
    }

    CerrarModal_nuevo = () => {
        this.setState({modal_nuevo: false})
    }

    Accion_nuevo = () => {
        if (this.validator.allValid()) {
            console.info(this.state)
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
                obr_usu_act: localStorage.getItem("usuario"),
                obr_fecha_act: Moment().format('YYYY-MM-DD HH:mm')
            }),
            }).then((res) => {
                if (res.status === 200) {
                    this.CerrarModal_nuevo()
                    window.location.href = '/obras'
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
        const res = await fetch(`/get_obras?` + new URLSearchParams({ id: id}))
        const data = await res.json()
        console.info(data)
        this.setState({
                obr_nombre: data[0].obr_nombre,
                obr_val_operador: data[0].obr_val_operador,
                obr_val_maquina: data[0].obr_val_maquina,
                use_id: data[0].use_id,
                obr_horas_mes: data[0].obr_horas_mes,
                cos_id: data[0].cos_id,
                obr_lunes: data[0].obr_lunes,
                obr_martes: data[0].obr_martes,
                obr_miercoles: data[0].obr_miercoles,
                obr_jueves: data[0].obr_jueves,
                obr_viernes: data[0].obr_viernes,
                obr_sabado: data[0].obr_sabado,
                obr_domingo: data[0].obr_domingo,
                obr_id: id
            })
    }

    CerrarModal_editar = () => {
        this.setState({modal_editar: false})
    }

    Accion_editar = () => {
        if (this.validator.allValid()) {
            fetch("/editar_obra", {
                method: "PUT",
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
                obr_usu_act: localStorage.getItem("usuario"),
                obr_fecha_act: Moment().format('YYYY-MM-DD HH:mm'),
                id: this.state.obr_id
            }),
            }).then((res) => {
               
                if (res.status === 200) {
                    this.CerrarModal_editar()
                    window.location.href = '/obras'
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

        fetch('/eliminar_obra' , {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           id: id
           })
       })
       window.location.href = '/obras'
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    Reset_obras = () => {
        this.setState({
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
        })
    }
    
    render () {
        return (
            <div className="wrapper">
                 <Modal
                    title="Crear Obra"
                    visible={this.state.modal_nuevo}
                    onOk={this.Accion_nuevo.bind(this)}
                    onCancel={this.CerrarModal_nuevo.bind(this)}
                    width="800px"
                    centered
                >
                    <form id="form" onSubmit="" className="form-group col-md-12">
                        <div className="row contenedor ml-5">
                            <div className="row col-md-4">
                                <label htmlFor="obr_nombre" className="col-md-12 col-form-label">Nombre</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="text"
                                    name="obr_nombre" 
                                    className="ant-input"
                                />
                                {this.validator.message('nombre', this.state.obr_nombre, 'required|max:50|min:3', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="obr_val_operador" className="col-md-12  col-form-label">Valor operador</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_val_operador" 
                                    className="ant-input"
                                />
                                {this.validator.message('Val operador', this.state.obr_val_operador, 'required|numeric|min:0,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="obr_val_maquina" className="col-md-12  col-form-label">Valor maquina</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_val_maquina" 
                                    className="ant-input"
                                />
                                {this.validator.message('Val maquina', this.state.obr_val_maquina, 'required|numeric|min:0,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="use_id"  className="col-md-12 col-form-label">Director de obra</label>
                                <div className="col-md-10">zz
                                    <select onChange={this.onChange.bind(this)} name="use_id"        className="ant-input" allowClear>
                                        <option value="">----------</option>
                                        {
                                            this.state.obr_directores.map(director =>
                                                <option key={ director.use_id } value={director.use_id}>{`${director.use_nombre} ${director.use_apellido}`}</option>
                                            )
                                        } 
                                    </select>
                                    {this.validator.message('director', this.state.use_id, 'required|numeric|min:0,num',  { className: 'text-danger' })}
                                </div>    
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="obr_horas_mes" className="col-md-12  col-form-label">Horas por mes</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_horas_mes" 
                                    className="ant-input"
                                />
                                {this.validator.message('Horas por mes', this.state.obr_horas_mes, 'required|numeric|min:0,num|max:4', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="cos_id"  className="col-md-12 col-form-label">Centro de costos</label>
                                <div className="col-md-10">
                                    <select onChange={this.onChange.bind(this)} name="cos_id"        className="ant-input" allowClear>
                                        <option value="">---------</option>
                                        {
                                            this.state.obr_costos.map(costo =>
                                                <option key={ costo.cos_id } value={costo.cos_id}>{costo.cos_nombre}</option>
                                            )
                                        } 
                                    </select>
                                    {this.validator.message('centro de costos', this.state.cos_id, 'required|numeric|min:0,num',  { className: 'text-danger' })}
                                </div>    
                            </div>
                            <h3 className="row col-md-12 mt-2 mb-2 justify-content-center">Horarios</h3>
                            <div className="row col-md-3">
                                <label htmlFor="obr_lunes" className="col-md-12 col-form-label">Lunes</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_lunes" 
                                    className="ant-input"
                                />
                                {this.validator.message('lunes', this.state.obr_lunes, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_martes" className="col-md-12 col-form-label">Martes</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_martes" 
                                    className="ant-input"
                                />
                                {this.validator.message('martes', this.state.obr_martes, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_miercoles" className="col-md-12 col-form-label">Miercoles</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_miercoles" 
                                    className="ant-input"
                                />
                                {this.validator.message('miercoles', this.state.obr_miercoles, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_jueves" className="col-md-12 col-form-label">Jueves</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_jueves" 
                                    className="ant-input"
                                />
                                {this.validator.message('jueves', this.state.obr_jueves, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_viernes" className="col-md-12 col-form-label">Viernes</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_viernes" 
                                    className="ant-input"
                                />
                                {this.validator.message('viernes', this.state.obr_viernes, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_sabado" className="col-md-12 col-form-label">Sabado</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_sabado" 
                                    className="ant-input"
                                />
                                {this.validator.message('sabado', this.state.obr_sabado, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_domingo" className="col-md-12 col-form-label">Domingo</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    type="number"
                                    name="obr_domingo" 
                                    className="ant-input"
                                />
                                {this.validator.message('domingo', this.state.obr_domingo, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
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
                        </div>
                    </form>
                </Modal>
                <Modal
                    title="Editar Obra"
                    visible={this.state.modal_editar}
                    onOk={this.Accion_editar.bind(this)}
                    onCancel={this.CerrarModal_editar.bind(this)}
                    width="800px"
                    centered
                >
                    <form id="form" onSubmit="" className="form-group col-md-12">
                        <div className="row contenedor ml-5">
                            <div className="row col-md-4">
                                <label htmlFor="obr_nombre" className="col-md-12 col-form-label">Nombre</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_nombre}
                                    type="text"
                                    name="obr_nombre" 
                                    className="ant-input"
                                />
                                 {this.validator.message('nombre', this.state.obr_nombre, 'required|max:50|min:3', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="obr_val_operador" className="col-md-12  col-form-label">Valor operador</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_val_operador}
                                    type="number"
                                    name="obr_val_operador" 
                                    className="ant-input"
                                />
                               {this.validator.message('Val operador', this.state.obr_val_operador, 'required|numeric|min:0,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="obr_val_maquina" className="col-md-12  col-form-label">Valor maquina</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_val_maquina}
                                    type="number"
                                    name="obr_val_maquina" 
                                    className="ant-input"
                                />
                                {this.validator.message('Val maquina', this.state.obr_val_maquina, 'required|numeric|min:0,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="use_id"  className="col-md-12 col-form-label">Director de obra</label>
                                <div className="col-md-10">
                                    <select onChange={this.onChange.bind(this)} value={this.state.use_id} name="use_id" className="ant-input" allowClear>
                                        <option value="">----------</option>
                                        {
                                            this.state.obr_directores.map(director =>
                                                <option key={ director.use_id } value={director.use_id}>{director.use_nombre}</option>
                                            )
                                        } 
                                    </select>
                                    {this.validator.message('director', this.state.use_id, 'required|numeric|min:0,num',  { className: 'text-danger' })}
                                </div>    
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="obr_horas_mes" className="col-md-12  col-form-label">Horas por mes</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_horas_mes}
                                    type="number"
                                    name="obr_horas_mes" 
                                    className="ant-input"
                                />
                             {this.validator.message('Horas por mes', this.state.obr_horas_mes, 'required|numeric|min:0,num|max:4', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-4">
                                <label htmlFor="cos_id"  className="col-md-12 col-form-label">Centro de costos</label>
                                <div className="col-md-10">
                                    <select onChange={this.onChange.bind(this)} value={this.state.cos_id} name="cos_id"        className="ant-input" allowClear>
                                        <option value="">---------</option>
                                        {
                                            this.state.obr_costos.map(costo =>
                                                <option key={ costo.cos_id } value={costo.cos_id}>{costo.cos_nombre}</option>
                                            )
                                        } 
                                    </select>
                                    {this.validator.message('centro de costos', this.state.cos_id, 'required|numeric|min:0,num',  { className: 'text-danger' })}
                                </div>    
                            </div>
                            <h3 className="row col-md-12 mt-2 mb-2 justify-content-center">Horarios</h3>
                            <div className="row col-md-3">
                                <label htmlFor="obr_lunes" className="col-md-12 col-form-label">Lunes</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_lunes}
                                    type="number"
                                    name="obr_lunes" 
                                    className="ant-input"
                                />
                                {this.validator.message('lunes', this.state.obr_lunes, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_martes" className="col-md-12 col-form-label">Martes</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_martes}
                                    type="number"
                                    name="obr_martes" 
                                    className="ant-input"
                                />
                                {this.validator.message('martes', this.state.obr_martes, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_miercoles" className="col-md-12 col-form-label">Miercoles</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_miercoles}
                                    type="number"
                                    name="obr_miercoles" 
                                    className="ant-input"
                                />
                                {this.validator.message('miercoles', this.state.obr_miercoles, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_jueves" className="col-md-12 col-form-label">Jueves</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_jueves}
                                    type="number"
                                    name="obr_jueves" 
                                    className="ant-input"
                                />
                                {this.validator.message('jueves', this.state.obr_jueves, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_viernes" className="col-md-12 col-form-label">Viernes</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_viernes}
                                    type="number"
                                    name="obr_viernes" 
                                    className="ant-input"
                                />
                                {this.validator.message('viernes', this.state.obr_viernes, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_sabado" className="col-md-12 col-form-label">Sabado</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_sabado}
                                    type="number"
                                    name="obr_sabado" 
                                    className="ant-input"
                                />
                                {this.validator.message('sabado', this.state.obr_sabado, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
                                </div>
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="obr_domingo" className="col-md-12 col-form-label">Domingo</label>
                                <div className="col-md-10"><input
                                    onChange={this.onChange.bind(this)}
                                    value={this.state.obr_domingo}
                                    type="number"
                                    name="obr_domingo" 
                                    className="ant-input"
                                />
                                {this.validator.message('domingo', this.state.obr_domingo, 'required|numeric|min:1,num|max:24,num', { className: 'text-danger' })}
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
                        </div>
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

export default Obras