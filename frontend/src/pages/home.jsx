import React from 'react'
import Footer from  '../components/Footer';
import Menu from '../components/Menu';

const Home = () => {

 

    return (
        <>
            <Menu></Menu>
            {/*UBICAR EL MENU*/}
            <div className="content-wrapper">{/* CONTENIDO DEL MODULO */ }</div>
            <Footer/>
        </>
        
    )
}

export default Home
