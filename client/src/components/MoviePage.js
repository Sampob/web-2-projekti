import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Card, Container, Form, Modal, Table} from "react-bootstrap";
import Accordion from 'react-bootstrap/Accordion'
import {useNavigate} from "react-router-dom";
import {authenticateUser} from "../functions/AuthenticateUser";

const MoviePage = () => {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = useState(false);

    const [movie, setMovie] = useState({
        title: '',
        description: '',
        poster: ''
    });
    const [movieModal, changeModal] = useState(false);
    const [movieModalText, changeMovieModalText] = useState({});

    const [movieDescription, changeMovieDescription] = useState('');
    const [moviePoster, changeMoviePoster] = useState('');

    const handleMovieDescription = (e) => {
        changeMovieDescription(e.target.value);
    }
    const handleMoviePoster = (e) => changeMoviePoster(e.target.value);

    const closeModal = () => {
        changeModal(false);
    }

    const queryParams = new URLSearchParams(window.location.search);
    const selectedMovie = queryParams.get("title");

    useEffect(() => {
        authenticateUser().then(() => {
            setLoggedIn(true);
        }).catch(() => {
            setLoggedIn(false);
        });
        axios.get(("http://localhost:5000/getMovie:" + selectedMovie))
            .then(r => {
                if (r.data[0].description === '') r.data[0].description = "[No description]";
                setMovie(r.data[0]);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const editButton = (e) => {
        e.preventDefault();
        axios.put((("http://localhost:5000/editMovie/") + selectedMovie), {
            description: movieDescription,
            poster: moviePoster,
            accessToken: JSON.parse(localStorage.getItem('myToken')).accessToken
        })
            .then(() => {
                const editModal = {
                    title: "Success",
                    body: ["Editing ", selectedMovie, " successful!"],
                    footer: <Button onClick={reloadPage}>Close</Button>
                }
                changeMovieModalText(editModal);
                changeModal(true);
            })
            .catch(err => {
                console.log(err);
            });

    }

    const reloadPage = () => {
        window.location.reload(false);
    }

    const deleteButton = () => {
        const deleteModal = {
            title: ["Delete ", selectedMovie],
            body: "Are you sure?",
            footer: [<Button key="delete" onClick={deleteMovie} variant="danger">Delete</Button>,
                <Button key="close" onClick={closeModal}>Cancel</Button>]
        }
        changeMovieModalText(deleteModal);
        changeModal(true);
    }

    const deleteMovie = () => {
        axios
            .delete(("http://localhost:5000/deleteMovie/" + selectedMovie + "/"
                + JSON.parse(localStorage.getItem('myToken')).accessToken))
            .then(() => navigate('/list'))
            .catch(err => {
                console.log(err);
            });
    }

    return (
        <Container>
            <Modal show={movieModal} onHide={closeModal} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>{movieModalText.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>{movieModalText.body}</Modal.Body>
                <Modal.Footer>{movieModalText.footer}</Modal.Footer>
            </Modal>

            <br/>
            <Card>
                <Card.Img variant="top" src={movie.poster} alt="Movie poster"/>
                <Card.Body>
                    <Card.Title><h3>{movie.title}</h3></Card.Title>
                    <Card.Text>{movie.description}</Card.Text>
                    <Card.Text>
                        <h5>Actors</h5>
                        <Table striped>
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th> </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Leo Di Cap</td>
                                <td><Button>View</Button></td>
                            </tr>
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
            </Card>
            <br/>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Edit Movie</Accordion.Header>
                    <Accordion.Body>
                        <Form onSubmit={editButton}>
                            <Form.Group className="mb-3">
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows="4"
                                    placeholder={movie.description}
                                    value={movieDescription}
                                    onChange={handleMovieDescription}
                                    disabled={!loggedIn}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Poster</Form.Label>
                                <Form.Control
                                    type="file"
                                    value={moviePoster}
                                    onChange={handleMoviePoster}
                                    disabled={true}
                                />
                            </Form.Group>
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

export default MoviePage;