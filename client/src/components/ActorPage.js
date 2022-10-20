import {Accordion, Button, Card, Container, Form, Modal, Table} from "react-bootstrap";
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {authenticateUser} from "../functions/AuthenticateUser";
import axios from "axios";
import {forEach} from "react-bootstrap/ElementChildren";


const ActorPage = () => {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = useState(false);

    const [actor, setActor] = useState({});
    const [movies, setMovies] = useState([]);
    const [actorMovies, setActorMovies] = useState([]);
    const [checkedB, setCheckedB] = useState([]);

    const [actorModal, changeModal] = useState(false);
    const [actorModalText, changeActorModalText] = useState({});

    const queryParams = new URLSearchParams(window.location.search);
    const selectedActor = queryParams.get("name");

    const closeModal = () => {
        changeModal(false);
    }

    useEffect(() => {
        authenticateUser().then(() => {
            setLoggedIn(true);
        }).catch(() => {
            setLoggedIn(false);
        });
        axios.get(("http://localhost:5000/getActor:" + selectedActor))
            .then(r => {
                setActor(r.data[0]);
            })
            .catch(err => {
                console.log(err);
            });
        axios.get(("http://localhost:5000/selectActorMovies:" + selectedActor))
            .then(r => {
                setActorMovies(r.data);
                let temp = [];
                for (let i = 0; i < r.data.length; i++) {
                    temp.push(r.data[i].id);
                }
                setCheckedB(temp);
            })
            .catch(err => {
                console.log(err);
            });
        axios.get("http://localhost:5000/getMovies")
            .then(r => {
                setMovies(r.data);
            })
            .catch(err => {
                console.log(err);
            });
    }, []);

    const deleteButton = () => {
        const deleteModal = {
            title: ["Delete ", selectedActor],
            body: "Are you sure?",
            footer: [<Button key="delete" onClick={deleteActor} variant="danger">Delete</Button>,
                <Button key="close" onClick={closeModal}>Cancel</Button>]
        }
        changeActorModalText(deleteModal);
        changeModal(true);
    }

    const deleteActor = () => {
        axios
            .delete(("http://localhost:5000/deleteActor/" + selectedActor + "/"
                + JSON.parse(localStorage.getItem('myToken')).accessToken))
            .then(() => navigate('/list'))
            .catch(err => {
                console.log(err);
            });
    }

    //Calls this five times for some reason
    const displayMovies = actorMovies.map((data) => {
        return (
            <tr key={data.id}>
                <td>{data.title}</td>
                <td>
                    <Link to={"/movie?title=" + data.title}><Button>View</Button></Link>
                </td>
            </tr>
        );
    });

    const confirmEdit = (e) => {
        e.preventDefault();

        axios.put(("http://localhost:5000/editTableActorMovie:" + selectedActor), {
            movies: checkedB,
            accessToken: JSON.parse(localStorage.getItem('myToken')).accessToken
        })
            .then(() => {
                const editModal = {
                    title: "Success",
                    body: "Movies updated",
                    footer: <Button onClick={reloadPage}>Close</Button>
                }
                changeActorModalText(editModal);
                changeModal(true);
            })
            .catch(err => {
                console.log(err);
            })
    }

    const checkC = (value) => {
        return checkedB.includes(parseInt(value));
    }

    const editMovies = (value) => {
        if (checkedB.includes(parseInt(value.target.id))) {
            setCheckedB(checkedB.filter((v) => {
                return v !== parseInt(value.target.id);
            }));
        } else {
            checkedB.push(parseInt(value.target.id));
        }
    }

    const reloadPage = () => {
        window.location.reload(false);
    }

    return (
        <Container>
            <Modal show={actorModal} onHide={closeModal} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{actorModalText.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{actorModalText.body}</Modal.Body>
                <Modal.Footer>{actorModalText.footer}</Modal.Footer>
            </Modal>

            <br/>
            <Card>
                <Card.Body>
                    <Card.Title><h3>{actor.name}</h3></Card.Title>
                    <h5>Movies</h5>
                    <Table striped>
                        <thead>
                        <tr>
                            <th>Title</th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {displayMovies}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
            <br/>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Edit Actor</Accordion.Header>
                    <Accordion.Body>
                        <Form onSubmit={confirmEdit}>
                            {movies.map((data) => (
                                <Form.Check
                                    defaultChecked={checkC(data.id)}
                                    type="checkbox"
                                    id={data.id}
                                    label={data.title}
                                    onChange={editMovies}
                                    disabled={!loggedIn}
                                />
                            ))}
                            <Button disabled={!loggedIn} variant="success" type="submit">Edit</Button>
                        </Form>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <br/>
            <Button disabled={!loggedIn} onClick={deleteButton} variant="danger">Delete</Button>
        </Container>
    )
}

export default ActorPage;