import React from 'react';
import { Link, BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Pais from '../Pages/Pais';
import Home from '../Pages/Home';
import Provincias from '../Pages/Provincias';
import Partido from '../Pages/Partidos';
import Localidad from '../Pages/Localidades';


function NavBa() {

  return (

    <>
      <Router>
        <div>

          <Navbar bg="dark" variant="dark">
            <Container>
              <Navbar.Brand as={Link} to={"/Home"}>Navbar</Navbar.Brand>
              <Nav className="me-auto">
                <Nav.Link as={Link} to={"/Home"}>Home</Nav.Link>
                <Nav.Link as={Link} to={"/Pais"}>Pais</Nav.Link>
                <Nav.Link as={Link} to={"/Provincias"}>Provincias</Nav.Link>
                <Nav.Link as={Link} to={"/Partidos"}>Partidos</Nav.Link>
                <Nav.Link as={Link} to={"/Localidades"}>Localidades</Nav.Link>



              </Nav>
            </Container>
          </Navbar>
        </div>

        <div>
          <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/Home">
              <Home />
            </Route>
            <Route path="/Pais">
              <Pais />
            </Route>
            <Route path="/Provincias">
              <Provincias />
            </Route>
            <Route path="/Partidos">
              <Partido />
            </Route>
            <Route path="/Localidades">
              <Localidad />
            </Route>
            
          </Switch>
        </div>


      </Router>
    </>
  )
}

export default NavBa;