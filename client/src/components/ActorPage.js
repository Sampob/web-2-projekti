import {Accordion, Button, Card, Container, Form, Modal, Table} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {authenticateUser} from "../functions/AuthenticateUser";
import axios from "axios";


const ActorPage = () => {

    const navigate = useNavigate();

    const [loggedIn, setLoggedIn] = useState(false);

    const [actor, setActor] = useState({});

    const queryParams = new URLSearchParams(window.location.search);
    const selectedActor = queryParams.get("name");

    useEffect(() => {
        authenticateUser().then(() => {
            setLoggedIn(true);
        }).catch(() => {
            setLoggedIn(false);
        });
        axios.get(("http://localhost:5000/getActor:" + selectedActor))
            .then(r => {
                if (r.data[0].description === '') r.data[0].description = "[No description]";
                setActor(r.data[0]);
            })
            .catch(err => {
                console.log(err);
            })
    }, []);

    const deleteButton = () => {

    }

    return (
        <Container>
            <Modal>

            </Modal>

            <br/>
            <Card>
                <Card.Body>
                    <Card.Title><h3>{actor.name}</h3></Card.Title>
                    <Card.Text>
                        <h5>Movies</h5>
                        <Table striped>
                            <thead>
                            <tr>
                                <th>Title</th>
                                <th> </th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>Titanic</td>
                                <td><Button>View</Button></td>
                            </tr>
                            </tbody>
                        </Table>
                    </Card.Text>
                </Card.Body>
            </Card>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>Edit Actor</Accordion.Header>
                    <Accordion.Body>
                        Edit here
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
            <br/>
            <Button disabled={!loggedIn} onClick={deleteButton} variant="danger">Delete</Button>
        </Container>
    )
}

export default ActorPage;