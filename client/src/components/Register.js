import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";

const Register = () => {

    const navigate = useNavigate();

    const [formUsername, changeFormUsername] = useState('');
    const [formEmail, changeFormEmail] = useState('');
    const [formPassword, changeFormPassword] = useState('');
    const [successModal, changeSuccessModal] = useState(false);

    const handleUsername = (event) => changeFormUsername(event.target.value);
    const handleEmail = (event) => changeFormEmail(event.target.value);
    const handlePassword = (event) => changeFormPassword(event.target.value);

    const showSuccessModal = () => changeSuccessModal(true);
    const closeSuccessModal = () => {
        changeSuccessModal(false);
        navigate('/user');
    }

    const newUser = (e) => {
        try {
            e.preventDefault();
        } catch {

        }

        axios
            .post('http://localhost:5000/newUser', {
                username: formUsername,
                email: formEmail,
                password: formPassword
            }).then(() => showSuccessModal())
            .catch(err => {
                console.error(err);
            });

    }

    return (
        <>
            <Modal show={successModal} onHide={closeSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User created</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Hello {formUsername}! Redirecting you to the home page.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={closeSuccessModal}>Close</Button>
                </Modal.Footer>
            </Modal>
            <br/>
            <h3>Register</h3>
            <Form onSubmit={newUser}>
                <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                    type="text"
                    placeholder="Username"
                    value={formUsername}
                    onChange={handleUsername}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={formEmail}
                        onChange={handleEmail}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="loginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={formPassword}
                        onChange={handlePassword}
                    />
                </Form.Group>
                <Button variant="success" type="submit">Register</Button>
            </Form>
        </>
    )


}

export default Register;