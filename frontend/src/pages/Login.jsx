import React, {useState} from 'react';

const Login = () => {

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [error, setError] = useState(null)
    
    const LoginUsuario = async(e) => {
        e.preventDefault();

        if(email === '') {
            setError('Ingresa tu email')
        } else if (pass === '') {
            setError('ingresa tu contraseña')
        } else {
            console.info("Entro");
            const res = await fetch('/inicio_sesion?' + new URLSearchParams({ use_correo: email, use_contrasena: pass }));
            console.log(res);
            const data = await res.json();

            if(data === 'usuario no encontrado verifica datos') {
                setError('datos invalidos')
            } else if(data.length !== 0) {
                console.log("dentro")
                window.localStorage.setItem('tipo', data[0].tipo)
                window.location.href = '/home'
            }
        }    
    }

    return (
        <> 
      <div className="login-box">
      <div className="login-logo">
        <a href="../../index2.html"><b>Admin</b>LTE</a>
      </div>
    
      <div className="card">
        <div className="card-body login-card-body" >
      <div className="App">
        <p className="login-box-msg">Sign in to start your session</p>
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
         <div className="row">
           <div className="col-8">
             
           </div>
           <div className="col-4">
             <button type="submit" className="btn btn-primary btn-block">Sign In</button>
           </div>
         </div>
        
        </form>
        <p className="mb-1">
          <a href="forgot-password.html">I forgot my password</a>
        </p>
        <p className="mb-0">
          <a href="register.html" className="text-center">Register a new membership</a>
        </p>     
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