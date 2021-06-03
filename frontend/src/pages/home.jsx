import React from 'react'
import Footer from  '../components/Footer';
import Menu from '../components/Menu';
import Nav from '../components/Nav';

const Home = () => {

 

    return (
    
        <div className="col-md-12">
            <Nav/>
            <Menu></Menu>
            {/*UBICAR EL MENU*/}
            <div className="content-wrapper">{/* CONTENIDO DEL MODULO */ }</div>
            <Footer/>
        </div>  
    )
}

export default Home
