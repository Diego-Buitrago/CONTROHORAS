import React from "react";
import { Redirect, Route } from "react-router-dom";
import {_Home} from "../config/path";
import useAuthContext from "../hooks/useAuthContext";

const PublicRoute = (props) => {
  const isAutenticated  = localStorage.getItem("authentication")

  if (isAutenticated) {
    return <Redirect to={_Home} />;
  }

  return <Route {...props} />;
};

export default PublicRoute;