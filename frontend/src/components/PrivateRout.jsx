import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {_Login} from '../config/path';
import useAuthContext from '../hooks/useAuthContext';

const PrivateRoute = (props) => {
    const isAutenticated = localStorage.getItem("authentication")

    if (!isAutenticated) {
        return <Redirect to={_Login}/>;
    }

    return <Route {...props} />;
}

export default PrivateRoute