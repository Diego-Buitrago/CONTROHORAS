import React, {Component} from 'react';
import SimpleReactValidator from 'simple-react-validator';

SimpleReactValidator.addLocale('custom', {

    accepted: 'Hab SoSlI’ Quch!',
    required: 'El campo :attribute es obligatorio.',
    max: ':attribute no debe ser mayor a :max:type.',
    min: 'El tamaño de :attribute debe ser de al menos :min:type.',

});

class Recuperar extends Component {

    validator = new SimpleReactValidator({ locale:'custom'});
    
    state = {
        contrasena: '',
        confi_contrasena: ''
    }
  
    recuperar_contra = async(e) => {
        e.preventDefault();
        if (this.validator.allValid()) {
            fetch("/actulizar_contrasena", {
                method: "PUT",
                headers: {
                "Content-Type": "application/json",
            },
                body: JSON.stringify({
                    use_contrasena: this.state.contrasena,
                    use_correo: localStorage.getItem("recuperar")
                }),
            }).then((res) => {
                if (res.status === 200) {
                    window.localStorage.removeItem("recuperar", true);
                    window.location.href = '/'
                } else {
                    this.setState({error: 'Error en el servidor contacta al administrador'})
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
            <> 
             
              <div className="login-box">
              <div className="login-logo">
                <h3 className="bg-primary p-3">Sistema para Restablecer contraseña</h3>
              </div>
            
              <div className="card">
                <div className="card-body login-card-body" >
              <div className="App">
                <p className="login-box-msg">Ingrsa la nueva contraseña</p>
                <form onSubmit={(e)=>{this.recuperar_contra(e)}}>
                
                {this.validator.message('contraseña', this.state.contrasena, 'required|min:8', { className: 'text-danger' })}
                <div className="input-group mb-3">
                  <input onChange={this.onChange.bind(this)} type="password" name="contrasena" className="form-control" placeholder="contraseña"/>
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock"></span>
                    </div>
                  </div>
                </div>

                {this.validator.message('confirmar contraseña', this.state.confi_contrasena, 'required|min:8|in:' + this.state.contrasena , { className: 'text-danger' })}
                <div className="input-group mb-3">
                  <input onChange={this.onChange.bind(this)} name="confi_contrasena" type="password" className="form-control" placeholder="confirma la contraseña"/>
                  <div className="input-group-append">
                    <div className="input-group-text">
                      <span className="fas fa-lock"></span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-8">
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary btn-block">Recuperar</button>
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
          </>
         
        );
    }
}
  
export default Recuperar;