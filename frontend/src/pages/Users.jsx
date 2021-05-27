import React, {Component} from 'react'
import {Modal, Table} from 'antd'
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import Nav from '../components/Nav';
import SimpleReactValidator from 'simple-react-validator'
SimpleReactValidator.addLocale('custom', {
    accepted: 'Hab SoSlI’ Quch!',
    email: 'Ingresar un correo valido. Ejemplo: example@ex.com',
    required: 'El campo :attribute es obligatorio.',
    max: ':attribute no debe ser mayor a :max:type.',
    min: 'El tamaño de :attribute debe ser de al menos :min:type.',
    alpha: ':attribute sólo debe contener letras.'
});


class Usuarios extends Component {

  
    validator = new SimpleReactValidator({ locale:'custom'});
    validatorEdi = new SimpleReactValidator({ locale:'custom'});

    state = {
        datos: [],
        perfiles: [],
        use_id: null,
        use_nombre: '',
        use_apellido: '',
        use_documento: '',
        use_correo: '',
        use_contrasena: '',
        conf_use_contrasena: '',
        use_tipo: '',
        per_nombre: '',
        modal: false,
        modalEdid: false,
        error: null,
        columns: [
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
                dataIndex: 'perfil',
                
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
        fetch("/usuarios", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            use_nombre: this.state.use_nombre,
            use_apellido: this.state.use_apellido,
            use_documento: this.state.use_documento
        }),
        })
        .then(response => response.json())
        .then(data => {
            const array = []
            data.map(item =>
                array.push({
                    key: item.id, 
                    nombre: item.use_nombre, 
                    apellido: item.use_apellido,
                    documento: item.use_documento, 
                    correo: item.use_correo,
                    tipo: item.use_tipo,
                    perfil: item.per_nombre,
                    editar: (<button
                            onClick={() => {this.Editar(item.id)}}
                            className="btn btn-primary"
                        >
                            Editar
                        </button>),
                    eliminar: (<button
                            className="btn btn-danger"
                            onClick={() => {this.Eliminar(item.id)}}
                        >
                            Eliminar
                        </button>)
                })
            )
            this.setState({datos: array})
        });
    
        const res = await fetch(`/perfiles_actvos?` + new URLSearchParams({ estado: 1}))
        const data = await res.json()
        this.setState({perfiles :data})
    }

    Buscar = () => {
        this.Reset_user()
        fetch("/usuarios", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            use_nombre: this.state.use_nombre,
            use_apellido: this.state.use_apellido,
            use_documento: this.state.use_documento
        }),
        })
        .then(response => response.json())
        .then(data => {
            const array = []
            data.map(item =>
                array.push({
                    key: item.id, 
                    nombre: item.use_nombre, 
                    apellido: item.use_apellido,
                    documento: item.use_documento, 
                    correo: item.use_correo,
                    tipo: item.use_tipo,
                    perfil: item.per_nombre,
                    editar: (<button
                            onClick={() => {this.Editar(item.id)}}
                            className="btn btn-primary"
                        >
                            Editar
                        </button>),
                    eliminar: (<button
                            className="btn btn-danger"
                            onClick={() => {this.Eliminar(item.id)}}
                        >
                            Eliminar
                        </button>)
                })
            )
            this.setState({datos: array})
        });
    }

    Nuevo = () => {
        this.setState({modal: true})
    }

    CerrarModal = () => {
        this.setState({modal: false})
    }

    Accion = () => {
        if (this.validator.allValid()) {
            
                fetch("/registrar_usuario", {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    use_nombre: this.state.use_nombre,
                    use_apellido: this.state.use_apellido,
                    use_documento: this.state.use_documento,
                    use_correo: this.state.use_correo,
                    use_contrasena: this.state.use_contrasena,
                    use_tipo: this.state.use_tipo
                }),
                }).then((res) => {
                    if (res.status === 200) {
                    this.CerrarModal()
                    window.location.href = '/users'
                } else {this.state({error: 'Error en el servidor contacta al administrador'})}
                });
            
        } else {
           
            this.validator.showMessages();
            this.forceUpdate();
        }
           
    }

    Editar = async(id) => {
        this.setState({modalEdid: true})

        const res = await fetch(`/get_editar?` + new URLSearchParams({ id: id}))
        const data = await res.json()

        this.setState({
            use_nombre: data[0].use_nombre,
            use_apellido: data[0].use_apellido,
            use_documento: data[0].use_documento,
            use_correo: data[0].use_correo,
            use_tipo: data[0].use_tipo,           
            use_id: id
        })
    }

    CerrarModalEdid = () => {
        this.setState({modalEdid: false})
    }

    AccionEdid = () => {
        if (this.validatorEdi.allValid()) {
            fetch("/editar_usuario", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                use_nombre: this.state.use_nombre,
                use_apellido: this.state.use_apellido,
                use_documento: this.state.use_documento,
                use_correo: this.state.use_correo,
                use_contrasena: this.state.use_contrasena,
                use_tipo: this.state.use_tipo,
                use_id: this.state.use_id
            }),
            }).then((res) => {
                if (res.status === 200) {
                    this.Reset_user()
                    this.CerrarModalEdid()
                    window.location.href = '/users'
                } else {this.setState({error: 'Error en el servidor contacta al administrador'})}
            });
        } else {
            console.log(this.state);
            console.log("Error de validaco");
            this.validatorEdi.showMessages();
            this.forceUpdate();
        }
    }

    Eliminar = (id) => {

        fetch('/eliminar_usuario' , {
            method: 'DELETE',
            headers: {
               'Content-Type': 'application/json',
       },
       body: JSON.stringify({
           id: id
           })
       })
       window.location.href = '/users'
    }

    Reset_user = () => {
        this.setState({
            datos: [],
            use_nombre: '',
            use_apellido: '',
            use_documento: '',
            use_correo: '',
            use_tipo: '',
            use_id: null,
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
                title="Crear Usuario"
                visible={this.state.modal}
                onOk={this.Accion}
                onCancel={this.CerrarModal}
                centered
            >
                <form id="form" onSubmit="" className="form-group">
                    <div className="row form-group">
                        <label htmlFor="use_nombre" className="col-md-3 col-form-label">Nombre</label>
                        <div className="col-md-9"><input
                            onChange={this.onChange.bind(this)}
                            type="text"
                            name="use_nombre" 
                            className="ant-input"
                        />
                        {this.validator.message('nombre', this.state.use_nombre, 'required|alpha|min:4', { className: 'text-danger' })}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label htmlFor="use_apellido" className="col-md-3 col-form-label">Apellido</label>
                        <div className="col-md-9"><input
                           onChange={this.onChange.bind(this)}
                            type="text"
                            name="use_apellido" 
                            className="ant-input"
                        />
                        {this.validator.message('apellido', this.state.use_apellido, 'required|alpha|min:4', { className: 'text-danger' })}
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="use_documento" className="col-md-3 col-form-label">Documento</label>
                        <div className="col-md-9"><input
                            onChange={this.onChange.bind(this)}
                            type="text"
                            name="use_documento"
                            className="ant-input"
                        />
                        {this.validator.message('documento', this.state.use_documento, 'required|min:6|max:10', { className: 'text-danger' })}
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="use_correo" className="col-md-3 col-form-label">Correo</label>
                        <div className="col-md-9"><input
                           onChange={this.onChange.bind(this)}
                            type="email"
                            name="use_correo"
                            className="ant-input"
                        />
                        {this.validator.message('correo', this.state.use_correo, 'required|email', { className: 'text-danger' })}
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="use_contrasena" className="col-md-3 col-form-label">Contraseña</label>
                        <div className="col-md-9"><input
                           onChange={this.onChange.bind(this)}
                            type="password"
                            name="use_contrasena"
                            className="ant-input"
                        />
                        {this.validator.message('contraseña', this.state.use_contrasena, 'required|min:8|max:10|in:' + this.state.conf_use_contrasena +'|', { className: 'text-danger' })}
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="conf_contrasena" className="col-md-3 col-form-label">Confirmar Contraseña</label>
                        <div className="col-md-9"><input
                            onChange={this.onChange.bind(this)}
                            type="password"
                            name="conf_use_contrasena"
                            className="ant-input"
                        />
                        {this.validator.message('confirmar contraseña', this.state.conf_use_contrasena, 'required|min:8|max:10', { className: 'text-danger' })}
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="tipo" className="col-md-3 col-form-label">Tipo de usuario</label>
                        <div className="col-md-9">
                            <select onChange={this.onChange.bind(this)} name="use_tipo" className="ant-input" allowClear>
                                <option value="">----------------</option>
                                {
                                    this.state.perfiles.map(perfil =>
                                        <option value={perfil.id}>{perfil.per_estado === 1 ? perfil.per_nombre : ''}</option>
                                    )
                                }
                            </select>
                            {this.validator.message('tipo usuario', this.state.use_tipo, 'required', { className: 'text-danger' })}
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
                title="Editar Usuario"
                visible={this.state.modalEdid}
                onOk={this.AccionEdid.bind(this)}
                onCancel={this.CerrarModalEdid}
                centered
            >
                <form id="form" onSubmit="" className="form-group">
                    <div className="row form-group">
                        <label htmlFor="use_nombre" className="col-md-3 col-form-label">Nombre</label>
                        <div className="col-md-9"><input
                            onChange={this.onChange.bind(this)}
                            value={this.state.use_nombre}
                            type="text"
                            name="use_nombre" 
                            className="ant-input"
                        />
                         {this.validatorEdi.message('nombre', this.state.use_nombre, 'required|alpha|min:4', { className: 'text-danger' })}
                        </div>
                    </div>
                    <div className="row form-group">
                        <label htmlFor="use_apellido" className="col-md-3 col-form-label">Apellido</label>
                        <div className="col-md-9"><input
                           onChange={this.onChange.bind(this)}
                           value={this.state.use_apellido}
                            type="text"
                            name="use_apellido" 
                            className="ant-input"
                        />
                         {this.validator.message('apellido', this.state.use_apellido, 'required|alpha|min:4', { className: 'text-danger' })}
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="use_documento" className="col-md-3 col-form-label">Documento</label>
                        <div className="col-md-9"><input
                            onChange={this.onChange.bind(this)}
                            value={this.state.use_documento}
                            type="text"
                            name="use_documento"
                            className="ant-input"
                        />
                        {this.validatorEdi.message('documento', this.state.use_documento, 'required|min:6|max:10', { className: 'text-danger' })}
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="use_correo" className="col-md-3 col-form-label">Correo</label>
                        <div className="col-md-9"><input
                            onChange={this.onChange.bind(this)}
                            value={this.state.use_correo}
                            type="email"
                            name="use_correo"
                            className="ant-input"
                        />
                        {this.validatorEdi.message('correo', this.state.use_correo, 'required|email', { className: 'text-danger' })}
                        </div>       
                    </div>
                    <div className="row form-group">
                        <label htmlFor="tipo"  className="col-md-3 col-form-label">Tipo de usuario</label>
                        <div className="col-md-9">
                            <select value={this.state.use_tipo} onChange={this.onChange.bind(this)} name="use_tipo" className="ant-input" allowClear>
                                <option value="">----------------</option>
                                {
                                    this.state.perfiles.map(perfil =>
                                        <option value={perfil.id}>{perfil.per_estado === 1 ? perfil.per_nombre : ''}</option>
                                    )
                                }
                            </select>
                            {this.validatorEdi.message('tipo usuario', this.state.use_tipo, 'required', { className: 'text-danger' })}
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
                        <div className="row">
                                <div className="col-md-3">
                                    <label htmlFor="use_nombre">Nombre: </label>
                                    <input onChange={this.onChange.bind(this)} name="use_nombre" type="text"  className="ant-input"/></div>
                                <div className="col-md-3">
                                    <label htmlFor="use_apellido">Apellido: </label>
                                    <input onChange={this.onChange.bind(this)} name="use_apellido" type="text" className="ant-input"/></div>
                                <div className="col-md-3">
                                    <label htmlFor="use_documento">Documento: </label>
                                    <input onChange={this.onChange.bind(this)} name="use_documento" type="number" className="ant-input"/></div>
                                <div className="col-md-1"><br/>
                                    <button onClick={this.Buscar} className="btn btn-primary">Buscar</button>
                                </div>
                                <div className="col-md-1"><br/>
                                    <button onClick={this.Nuevo} className="btn btn-success">Nuevo</button>
                                </div>
                        </div>
                        <div className="row" >
                    <div className="col-md-12">
                        <Table 
                            className="table table-striped table-bordered mt-5" 
                            columns={this.state.columns} 
                            dataSource={this.state.datos}
                        />
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

export default Usuarios; 