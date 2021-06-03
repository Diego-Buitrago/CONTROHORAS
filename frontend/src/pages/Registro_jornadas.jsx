import React, {Component} from 'react';
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import Nav from '../components/Nav';
import Moment from 'moment';

class Costos extends Component {
    

    state = {
        empleados: [],
        obras: [],
        tipo_novedades: [],
        anos: [],
        semanas: [],
        sem_min: 1,
        sem_max: 52,
        ano_min: 2020,
        ano_max: Moment().format('YYYY'),
        empleado: '',
        semana:'',
        obra: '',
        ano: '',
        fechas: []
       /*  datos_tabla: [{
            dia: 'lunes',
            boton: (<button className="btn btn-outline-success">Agregar</button>),
            Obra: (<select onChange={this.onChange.bind(this)} name="obra" className="ant-input" allowClear>
                        <option value="">-------------</option>
                        {
                            this.state.obras.map(obra =>
                                <option key={obra.obr_id} value={obra.obr_id}>{obra.obr_nombre}</option>
                            )
                        }
                    
                    </select>),
            hora_inicio: (<select onChange={this.onChange.bind(this)} name="hora_inicio"
                                className="ant-input" allowClear>
                            <option value="">-------------</option>
                        
                        </select>),
            hora_fin:  (<select onChange={this.onChange.bind(this)} name="hora_fin" className="ant-input" 
                            allowClear>
                            <option value="">-------------</option>
    
                        </select>),
            tipo_novedad: (<select onChange={this.onChange.bind(this)} name="novedad" className="ant-input" 
                                allowClear>
                            <option value="">-------------</option>
                            {
                                this.state.tipo_novedades.map(novedad =>
                                    <option key={novedad.id} value={novedad.id}>{novedad.nov_nombre}</option>
                                )
                            }  
                        </select>),
            observaciones: (<input
                                onChange={this.onChange.bind(this)} type="text" name="observaciones" 
                                className="ant-input"
                            />)
        }] */
    }


    async componentDidMount() {
        // Cargar usuarios
        const res_empleados = await fetch('/usuarios', {method: "POST"})
        const data_empleados = await res_empleados.json();
        this.setState({empleados: data_empleados}) 

        // Cargar obras
        const res_obras = await fetch('/obras', {method: "POST"})
        const data_obras = await res_obras.json();
        this.setState({obras: data_obras})

        // Cargar tipo de novedad
        const res_novedades = await fetch('/tipo_novedades')
        const data_novedades = await res_novedades.json();
        this.setState({tipo_novedades: data_novedades})

        for(let v = this.state.ano_max; v >= this.state.ano_min; v-- ){
              const newAno = {
                id: v,
              };
              this.setState({anos: [...this.state.anos, newAno]})
        }
    }

    cargarSemana = () => {
        
        if(this.state.ano === this.state.ano_max) {
            this.state.sem_max = parseInt(Moment().format('w'))
        } else {
            this.state.sem_max = 52
        }
        const sems = []

        for(let sem = this.state.sem_max; sem >= this.state.sem_min; sem--) {
            //let semana = this.state.ano + '' + s
            sems.push({id: sem < 10 ? `${this.state.ano}0${sem}` : `${this.state.ano}${sem}`})
            //this.setState({semanas: [...this.state.semanas, newSemana]})
        }
        this.setState({semanas: sems})
    }

    agregarHora = (id) => {
        fetch('/agregar_hora',{
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            id: id,
            usuario: this.state.semana,
            fec: ""
        }),
        })
        .then(response => response.json())
        .then(data => {
            // if()
            //{
                this.cargarHoras(id)
            //}

        })
    }
    cargarDias = () => {

        if (this.state.empleado > 0 && this.state.semana) {
            fetch("/cargar_dias", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                empleado: this.state.empleado,
                semana: this.state.semana
            }),
            })
            .then(response => response.json())
            .then(data => {
                const array = []
                if (data !== 'usuario no encontrado verifica datos') {
                    data.map(item =>
                        array.push({
                            key: item.jod_id, 
                            fecha: Moment(item.jod_fecha).format('YYYY-MM-DD'), 
                            crear: (<button className="btn btn-outline-success"
                                    onClick={() => {this.Editar(item.jod_id)}}
                                    className="btn btn-primary"
                                >
                                    <i className="fas fa-plus"></i>
                                </button>)
                        })
                    )
                }
                console.log(data)
                this.setState({fechas: array}) 
            });
        } 
    }

    cargarHoras = (id) => {

        fetch('/cargarHoras', {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            empleado: this.state.empleado,
            semana: this.state.semana
        }),
        })
        .then(response => response.json())
        .then(data => {
            const array = []
            if (data !== 'usuario no encontrado verifica datos') {
                data.map(item => {
                    return <tr>
                    <td className="border border-secondary">
                        <select onChange={this.onChange.bind(this)} name="obra" className="ant-input" allowClear>
                            <option value="">-------------</option>
                            {
                                this.state.obras.map(obra =>
                                    <option key={obra.obr_id} value={obra.obr_id}>{obra.obr_nombre}</option>
                                )
                            }
                        
                        </select>
                    </td>
                    <td className="border border-secondary">
                        <select onChange={this.onChange.bind(this)} name="hora_inicio" className="ant-input" allowClear>
                            <option value="">-------------</option>
                        
                        </select>
                    </td>
                    <td className="border border-secondary">
                        <select onChange={this.onChange.bind(this)} name="hora_fin" className="ant-input" allowClear>
                            <option value="">-------------</option>
                        
                        </select>
                    </td>
                    <td className="border border-secondary">
                        <select onChange={this.onChange.bind(this)} name="novedad" className="ant-input" allowClear>
                            <option value="">-------------</option>
                            {
                                this.state.tipo_novedades.map(novedad =>
                                    <option key={novedad.id} value={novedad.id}>{novedad.nov_nombre}</option>
                                )
                            }  
                        </select>
                    </td>
                    <td className="border border-secondary">
                        <input
                            onChange={this.onChange.bind(this)}
                            type="text"
                            name="observaciones" 
                            className="ant-input"
                        />
                    </td>
                    <td className="border border-secondary"></td>
                    </tr>
                }
                    
                )
            }
            console.log(data)
            this.setState({fechas: array}) 
        });
           
    }

    onChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    } 

    render () {
        return (
            <div className="wrapper col-md-12">
                <Nav></Nav>
                <Menu></Menu>
                <div className="content-wrapper col-md-12">  
                <section className="content">
                    <div className="container-fluid">
                    <form id="form" onSubmit="" className="form-group">
                        <div className="row contenedor">
                            <div className="row col-md-4">
                                <label htmlFor="empleado"  className="col-md-9 col-form-label">Empleado</label>
                                <div className="col-md-10">
                                    <select onChange={this.onChange.bind(this)} onClick={this.cargarDias} name="empleado" className="ant-input" allowClear>
                                        <option value="">-------------</option>
                                        {
                                            this.state.empleados.map(empleado =>
                                                <option key={empleado.use_id} value={empleado.use_id}>{`${empleado.use_nombre} ${empleado.use_apellido}`}</option>
                                            )
                                        }
                                       
                                    </select>
                                   {/*  {this.validator.message('estado', this.state.per_estado, 'required|integer',  { className: 'text-danger' })} */}
                                </div>    
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="ano"  className="col-md-9 col-form-label">Año</label>
                                <div className="col-md-10">
                                    <select onChange={this.onChange.bind(this)} onClick={this.cargarSemana} name="ano" className="ant-input" allowClear>
                                        <option value="">-------------</option>
                                    {
                                       this.state.anos.map(ano =>
                                        <option key={ano.id} value={ano.id}>{ano.id}</option>
                                    )
                                    }
                                
                                    </select>
                                   {/*  {this.validator.message('estado', this.state.per_estado, 'required|integer',  { className: 'text-danger' })} */}
                                </div>    
                            </div>
                            <div className="row col-md-3">
                                <label htmlFor="semana"  className="col-md-9 col-form-label">Semana</label>
                                <div className="col-md-10">
                                    <select onChange={this.onChange.bind(this)} onClick={this.cargarDias} name="semana" className="ant-input" allowClear>
                                        <option value="">-------------</option>
                                        {
                                            this.state.semanas.map(semana =>
                                                <option key={semana.id} value={semana.id}>{`${semana.id}`}</option>
                                            )
                                        }
                                       
                                    </select>
                                   {/*  {this.validator.message('estado', this.state.per_estado, 'required|integer',  { className: 'text-danger' })} */}
                                </div>    
                            </div>
                        </div>
                    </form>
                    <div className="row" >
                    <div className="col-md-12">
                        <table className="table table-striped table-responsive">
                            <tr>
                                <th className="border border-secondary">Obra</th>
                                <th className="border border-secondary">Hora de inicio</th>
                                <th className="border border-secondary">Hora fin</th>
                                <th className="border border-secondary">Tipo de novedad</th>
                                <th className="border border-secondary">Observaciones</th>
                                <th className="border border-secondary"></th>
                            </tr>

                            {   
                                this.state.fechas.map(fecha =>
                                    
                                         <tr>
                                            <td colSpan="5" className="text-center border border-secondary"><h5>{fecha.fecha}</h5></td>
                                            <td className="border border-secondary"><button className="btn btn-outline-success" onClick={this.agregarHora(fecha.key)}>Agregar</button></td>
                                        </tr>
                                         
                                       
                                    
                                )
                            }
                        </table>
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