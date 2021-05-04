import './App.css';
import Home from './components/home';
import Register from './components/register';
import Login from './components/login';
import Landing from './components/landing'

import { BrowserRouter as Router,Switch,Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="App">
    <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/landing" component={Landing}/>
   </Switch>
   </div>
    </Router>
    
  );
}

export default App;
