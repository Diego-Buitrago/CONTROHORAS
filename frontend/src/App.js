import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'

// Import pages
import Login from './pages/Login'
import Home from './pages/home'
import Users from './pages/Users'
import Profiles from './pages/Profiles'

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={Login}/>
        <Route path="/home" component={Home}/>
        <Route path="/users" component={Users}/>
        <Route path="/profiles" component={Profiles}/>
      </Switch>
    </Router>
  )
}

export default App;
