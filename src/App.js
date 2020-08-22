import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/home/home';
import Commerces from './components/commerce/commerces';
import Location from './components/location/location';
import Detail from './components/commerce/detail';
import Register from './components/commerce/register';
import Login from './components/authentication/Login';
import { AuthProvider } from './components/context/authContext';
import Menu from './components/authentication/Menu';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/location" component={Location} />
          <Route exact path="/:categoryId/comercios/:id" component={Commerces} />
          <Route exact path="/:comercios/:id" component={Detail} />
          <Route exact path="/registro" component={Register} />
          <Route exact path="/comercios/:id/edit" component={Register} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/menu" component={Menu} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
