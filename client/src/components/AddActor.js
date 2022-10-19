import {Button, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import MovieSelection from "./MovieSelection";

const AddActor = () => {

    const [actorName, changeActorName] = useState('');
    const [successModal, changeSuccessModal] = useState(false);

    const [actorError, changeActorError] = useState(false);

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
                    name: actorName
                }).then(() => showSuccessModal())
                .catch(err => {
                    console.log(err);
                });
        }

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
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Actor name"
                        value={actorName}
                        onChange={handleActorName}
                    />
                    <Form.FloatingLabel style={errorStyle} hidden={!actorError} label="Title required"/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="movieDescription">
                    <MovieSelection/>
                </Form.Group>

                <Button variant="success" type="submit">Add</Button>
            </Form>
        </>
    );
}

export default AddActor;