import {BrowserRouter as Router, Switch} from 'react-router-dom'
import {_Login, _Home, _Users, _Profiles, _Recover_password} from './config/path'
import PrivateRoute from './components/PrivateRout'
import PublicRoute from './components/PublicRout'

// Import pages
import Login from './pages/Login'
import Home from './pages/home'
import Users from './pages/Users'
import Profiles from './pages/Profiles'
import Recover_password from './pages/Recover_password'

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute exact path={_Login} component={Login}/>
        <PublicRoute path={_Recover_password} component={Recover_password}/>

        <PrivateRoute path={_Home} component={Home}/>
        <PrivateRoute path={_Users} component={Users}/>
        <PrivateRoute path={_Profiles} component={Profiles}/>
      </Switch>
    </Router>
  )
}

export default App;
