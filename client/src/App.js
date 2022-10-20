import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Container, Nav, Navbar} from "react-bootstrap";
import Home from "./components/Home";
import UserPage from "./components/UserPage";
import List from "./components/List";
import Add from "./components/Add";
import MoviePage from "./components/MoviePage";
import ActorPage from "./components/ActorPage";

function App() {

    return (
        <Container>
            <Router>
                <Navbar expand="sm">
                    <Navbar.Brand href="/">
                        Film-Listing
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
                    <Route path="list/*" element={<List/>}/>
                    <Route path="add" element={<Add/>}/>
                    <Route path="movie" element={<MoviePage/>}/>
                    <Route path="actor" element={<ActorPage/>}/>
                </Routes>
            </Router>
        </Container>
    );
}

export default App;
