import React, {useState, useEffect} from 'react'
import {Modal} from 'antd'
import Footer from '../components/Footer';
import Menu from '../components/Menu';
import Nav from '../components/Nav';


const Usuarios = () => {

    const [datos, setDatos] = useState([{}])
    const [per_nombre, setPer_nombre] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        
            fetch("/perfiles", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                per_nombre: per_nombre,
            }),
        })
        .then(response => response.json())
        .then(data => data === 'usuario no encontrado verifica datos' ? '' : setDatos(data));   
    }, []);
    console.log(datos)

    return (
        <div className="wrapper">
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
                                <div className="col-md-1"><br/>
                                    <button className="btn btn-primary">Buscar</button>
                                </div>
                                <div className="col-md-1"><br/>
                                    <button className="btn btn-success">Nuevo</button>
                                </div>
                        </div>
                        <div className="row" >
                    <div className="col-md-12"><table className="table table-striped table-bordered mt-5" id="table-usuarios">
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
                                        className="btn btn-p"
                                        onClick=""
                                    >
                                        Editar
                                    </button></td>
                                <td><button
                                        className="btn btn-danger"
                                        onClick=""
                                    >
                                        Eliminar
                                    </button></td>
                            </tr>
                        )
                        }
                    </tbody>
                    </table>
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