import React from 'react';
import './App.css';
import Login from './components/login/Login';
import Home from './components/home/Home'
import Register from './components/register/Register'
import Profile from './components/profile/Profile'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

function App() {
  return (
    <div className='App'>
      <div className='AppBackground'>
        <BrowserRouter>
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/home" component={Home}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/" component={Home} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );  
}

export default App;