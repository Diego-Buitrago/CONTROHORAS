import React, {useState} from 'react';
import { Modal } from 'antd';
import useAuthContext from "../hooks/useAuthContext";

const Login = () => {

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [correo_recu, setCorreo_recu] = useState('')
    const [error, setError] = useState(null)
    const [modal, setModal] = useState(false)
    //const { Login } = useAuthContext();
  
    const LoginUsuario = async(e) => {
        e.preventDefault();

        if(email === '') {
            setError('Ingresa tu email')
        } else if (pass === '') {
            setError('ingresa tu contraseña')
        } else {
            const res = await fetch('/inicio_sesion?' + new URLSearchParams({ use_correo: email, use_contrasena: pass }));
            const data = await res.json();

            if(data.message === 'contraseña invalida') {
                setError('Datos invalidos')
            } else if(data.length !== 0) {
              //Login()
              window.localStorage.setItem("authentication", true);
              window.location.href = '/home'
            }
        }    
    }

  const AbrirModal_recuperar = () => {
      setModal(true)
  }

  const CerrarModal_recuperar = () => {
      setModal(false)
  }

  const Accion_recuperar = () => {

    if(correo_recu) {
      window.localStorage.setItem('recuperar', correo_recu)

      fetch("/enviar_mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: correo_recu,
            subject: "recuperar contraseña"
          })
        }).then(res => {
            CerrarModal_recuperar()
      })
    }
  }

    return (
        <> 
          <Modal
            title="Recuperar contraseña"
            visible={modal}
            onOk={Accion_recuperar}
            onCancel={CerrarModal_recuperar}
            centered
          >
            <form id="form" className="form-group">
              <p>Te enviaremos un mensaje a tu correo registrado</p>
              <div className="row form-group">
                  <label htmlFor="correo_recu" className="col-md-3 col-form-label">Indresa tu correo</label>
                  <div className="col-md-9"><input
                    onChange={(e)=>{setCorreo_recu(e.target.value)}}
                    type="email"
                    name="correo_recu" 
                    className="ant-input"
                    />
                </div>
              </div>
            </form>
          </Modal>
          <div className="login-box">
          <div className="login-logo">
            <h3 className="bg-primary p-3">Sistema de Gestion de Vehiculos</h3>
          </div>
        
          <div className="card">
            <div className="card-body login-card-body" >
          <div className="App">
            <p className="login-box-msg">Inicia sesión para comenzar</p>
            <form onSubmit={(e)=>{LoginUsuario(e)}}>
              <div className="input-group mb-3">
                <input onChange={(e)=>{setEmail(e.target.value)}} type="email" className="form-control" placeholder="Email"/>
                <div className="input-group-append">
                  <div className="input-group-text">
                    <span className="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
            <div className="input-group mb-3">
              <input onChange={(e)=>{setPass(e.target.value)}} type="password" className="form-control" placeholder="Password"/>
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock"></span>
                </div>
              </div>
            </div>
            <div className="row justify-content-end mr-2">
              <p>
                <a onClick={AbrirModal_recuperar} className="c-primary">Olvidaste la contraseña</a>
              </p>
              </div>
            <div className="row">
              <div className="col-8">
              </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary btn-block">Iniciar sesión</button>
              </div>
            </div>
            
            </form>
            <div className="row">
              <div className="col-8">
              </div>
              <div className="col-12 ml-4 mt-4">
                <p>
                  Copyright © Todos los derechos reservados
                </p>
              </div>
            </div>   
          </div>
          
          </div>
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
      </>
     
    );
  }
  
export default Login;