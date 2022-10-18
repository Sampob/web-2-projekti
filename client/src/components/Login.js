import {Button, Form, Modal} from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {getUsername} from "../functions/GetUsername";

const Login = () => {

    const navigate = useNavigate();

    const [loginEmail, changeLoginEmail] = useState('');
    const [loginPassword, changeLoginPassword] = useState('');
    const [successModal, changeSuccessModal] = useState(false);

    const handleLoginEmail = (event) => changeLoginEmail(event.target.value);
    const handleLoginPassword = (event) => changeLoginPassword(event.target.value);

    const showSuccessModal = () => changeSuccessModal(true);
    const closeSuccessModal = () => {
        changeSuccessModal(false);
        navigate('/');
    }

    const loginUser = (e) => {
        try {
            e.preventDefault();
        } catch {

        }

        axios
            .post('http://localhost:5000/loginUser', {
                email: loginEmail,
                password: loginPassword
            })
            .then((res) => {
                localStorage.setItem('myToken', JSON.stringify(res.data));
                showSuccessModal();
            })
            .catch(err => console.error(err));
    }

    return (
        <>
            <Modal show={successModal} onHide={closeSuccessModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Logged in</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Hello {getUsername()}! Redirecting you to the home page.</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={closeSuccessModal}>Close</Button>
                </Modal.Footer>
            </Modal>
            <br/>
            <h3>Log in</h3>
            <Form onSubmit={loginUser}>
                <Form.Group className="mb-3" controlId="loginFormEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        value={loginEmail}
                        onChange={handleLoginEmail}
                    />
                </Form.Group>
                <Form.Group className="mb-3" controlId="loginFormPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={handleLoginPassword}
                    />
                </Form.Group>
                <Button variant="success" type="submit">Login</Button>
            </Form>
        </>
    )


}

export default Login;