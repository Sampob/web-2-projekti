import {Button, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";

const AddMovie = (props) => {

    const [movieTitle, changeMovieTitle] = useState('');
    const [movieDescription, changeMovieDescription] = useState('');
    const [moviePoster, setMoviePoster] = useState(''); //String, not in use
    const [successModal, changeSuccessModal] = useState(false);

    const [titleError, changeTitleError] = useState(false);
    const [titleErrorText, changeTitleErrorText] = useState('');

    const handleMovieTitle = (e) => {
        changeMovieTitle(e.target.value);
        changeTitleError(false);
    }
    const handleMovieDescription = (e) => changeMovieDescription(e.target.value);
    const handleMoviePoster = (e) => setMoviePoster(e.target.value); //Path of the photo, not in use

    const showSuccessModal = () => changeSuccessModal(true);
    const closeSuccessModal = () => {
        changeMovieTitle('');
        changeMovieDescription('');
        changeSuccessModal(false);
    }

    //TODO Poster uploading
    // eslint-disable-next-line
    const uploadFile = () => {

    }

    const validate = () => {
        let returnValue = true;
        if (movieTitle === '') {
            changeTitleErrorText('Title required');
            changeTitleError(true);
            returnValue = false;
        }
        return returnValue;
    }

    const addMovie = (e) => {
        try {
            e.preventDefault();
        } catch (err) {

        }

        if (validate()) {
            axios
                .post('http://localhost:5000/addMovie', {
                    title: movieTitle,
                    description: movieDescription,
                    accessToken: JSON.parse(localStorage.getItem('myToken')).accessToken
                }).then(() => showSuccessModal())
                .catch(err => {
                    inputError(err);
                });
        }
    }

    const inputError = (err) => {
        changeTitleErrorText(err.response.data.text);
        changeTitleError(true);
    }

    const errorStyle = {
        color: '#dc3545',
    }

    return (
        <>
            <Modal show={successModal} onHide={closeSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Movie added</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Movie "{movieTitle}" added to database.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={closeSuccessModal}>Close</Button>
                </Modal.Footer>
            </Modal>

            <br/>
            <h3>Add a Movie</h3>
            <Form onSubmit={addMovie}>
                <Form.Group className="mb-3" controlId="movieTitle">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Title"
                        value={movieTitle}
                        onChange={handleMovieTitle}
                        disabled={!props.loggedIn}
                    />
                    <Form.FloatingLabel style={errorStyle} hidden={!titleError} label={titleErrorText}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="movieDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows="4"
                        placeholder="Description"
                        value={movieDescription}
                        onChange={handleMovieDescription}
                        disabled={!props.loggedIn}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="moviePoster">
                    <Form.Label>Poster</Form.Label>
                    <Form.Control
                        type="file"
                        value={moviePoster}
                        onChange={handleMoviePoster}
                        disabled={true} //TEMPORARY
                    />
                </Form.Group>
                <Button disabled={!props.loggedIn} variant="success" type="submit">Add</Button>
            </Form>
        </>
    );
}

export default AddMovie;