import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {_Login, _Home, _Users, _Profiles} from './config/path'
import PrivateRoute from './components/PrivateRout'
import PublicRoute from './components/PublicRout'

// Import pages
import Login from './pages/Login'
import Home from './pages/home'
import Users from './pages/Users'
import Profiles from './pages/Profiles'

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute exact path={_Login} component={Login}/>
        <PrivateRoute path={_Home} component={Home}/>
        <PrivateRoute path={_Users} component={Users}/>
        <PrivateRoute path={_Profiles} component={Profiles}/>
      </Switch>
    </Router>
  )
}

export default App;
