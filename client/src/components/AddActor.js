import {Button, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import MovieSelection from "./MovieSelection";

const AddActor = (props) => {

    const [actorName, changeActorName] = useState('');
    const [successModal, changeSuccessModal] = useState(false);

    const [actorError, changeActorError] = useState(false);
    const [actorErrorText, changeActorErrorText] = useState('');

    const handleActorName = (e) => {
        changeActorName(e.target.value);
        changeActorError(false);
    }

    const showSuccessModal = () => changeSuccessModal(true);
    const closeSuccessModal = () => {
        changeActorName('');
        changeSuccessModal(false);
    }


    const validate = () => {
        let returnValue = true;
        if (actorName === '') {
            changeActorErrorText('Title required');
            changeActorError(true);
            returnValue = false;
        }
        return returnValue;
    }

    //TODO Error handling
    const addActor = (e) => {
        try {
            e.preventDefault();
        } catch (err) {

        }

        if(validate()) {
            axios
                .post('http://localhost:5000/addActor', {
                    name: actorName,
                    accessToken: JSON.parse(localStorage.getItem('myToken')).accessToken
                }).then(() => showSuccessModal())
                .catch(err => {
                    inputError(err);
                });
        }

    }

    const inputError = (err) => {
        changeActorErrorText(err.response.data.text);
        changeActorError(true);
    }

    const errorStyle = {
        color: '#dc3545',
    }

    //TODO Modal component with props
    return (
        <>
            <Modal show={successModal} onHide={closeSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Movie added</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Actor "{actorName}" added to database.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={closeSuccessModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            <br/>
            <h3>Add an Actor</h3>
            <Form onSubmit={addActor}>
                <Form.Group className="mb-3" controlId="movieTitle">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Actor name"
                        value={actorName}
                        onChange={handleActorName}
                        disabled={!props.loggedIn}
                    />
                    <Form.FloatingLabel style={errorStyle} hidden={!actorError} label={actorErrorText}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="movieDescription">
                    <MovieSelection/>
                </Form.Group>

                <Button disabled={!props.loggedIn} variant="success" type="submit">Add</Button>
            </Form>
        </>
    );
}

export default AddActor;