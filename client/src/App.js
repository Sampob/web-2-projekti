import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Container, Nav, Navbar} from "react-bootstrap";
import Home from "./components/Home";
import UserPage from "./components/UserPage";

function App() {

    return (
        <Container>
            <Router>
                <Navbar expand="sm">
                    <Navbar.Brand href="/">
                        React-App
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse>
                        <Nav>
                            <Nav.Link href="/">Home</Nav.Link>
                            <Nav.Link href="/add">Add</Nav.Link>
                            <Nav.Link href="/list">List</Nav.Link>
                            <Nav.Link href="/user">User</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>


                </Navbar>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="user" element={<UserPage/>}/>
                </Routes>
            </Router>
        </Container>
    );
}

export default App;
