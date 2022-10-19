import {Button, Form, Modal} from "react-bootstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {getUsername} from "../functions/GetUsername";

const Login = (props) => {

    const navigate = useNavigate();

    const [loginEmail, changeLoginEmail] = useState('');
    const [loginPassword, changeLoginPassword] = useState('');
    const [successModal, changeSuccessModal] = useState(false);

    const [emailError, changeEmailError] = useState(false);
    const [emailErrorText, changeEmailErrorText] = useState('');
    const [passwordError, changePasswordError] = useState(false);
    const [passwordErrorText, changePasswordErrorText] = useState('');

    const handleLoginEmail = (event) => {
        changeEmailError(false);
        changePasswordError(false);
        changeLoginEmail(event.target.value);
    }
    const handleLoginPassword = (event) => {
        changePasswordError(false);
        changeEmailError(false);
        changeLoginPassword(event.target.value);
    }

    const showSuccessModal = () => changeSuccessModal(true);
    const closeSuccessModal = () => {
        changeSuccessModal(false);
        navigate('/');
    }

    useEffect(() => {
        if (props.activeTab !== "login") cleanup();
    });

    const validate = () => {
        let returnValue = true;

        // eslint-disable-next-line
        const regex =
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (loginEmail === '' /*|| !regex.test(loginEmail)*/) {
            changeEmailError(true);
            changeEmailErrorText("Invalid Email");
            returnValue = false;
        }
        if(loginPassword === '') {
            changePasswordError(true);
            changePasswordErrorText("Invalid password");
            returnValue = false;
        }

        return returnValue;
    }

    const loginUser = (e) => {
        try {
            e.preventDefault();
        } catch {

        }

        if (validate()) {
            axios
                .post('http://localhost:5000/loginUser', {
                    email: loginEmail,
                    password: loginPassword
                })
                .then((res) => {
                    localStorage.setItem('myToken', JSON.stringify(res.data));
                    showSuccessModal();
                })
                .catch(err => {
                    inputError(err);
                });
        }
    }

    const inputError = (err) => {
        if (err.response.data.field === 2) {
            changeEmailError(true);
            changeEmailErrorText(err.response.data.text);
        } else if (err.response.data.field === 3) {
            changePasswordError(true);
            changePasswordErrorText(err.response.data.text);
        } else {
            console.log(err);
        }
    }

    const cleanup = () => {
        changeLoginEmail('');
        changeLoginPassword('');
        changeEmailError(false);
        changePasswordError(false);
    }

    const errorStyle = {
        color: '#dc3545',
        borderColor: '#dc3545'
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
                        placeholder="Email"
                        value={loginEmail}
                        onChange={handleLoginEmail}
                    />
                    <Form.FloatingLabel style={errorStyle} hidden={!emailError} label={emailErrorText}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginFormPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={loginPassword}
                        onChange={handleLoginPassword}
                    />
                    <Form.FloatingLabel style={errorStyle} hidden={!passwordError} label={passwordErrorText}/>
                </Form.Group>
                <Button variant="success" type="submit">Login</Button>
            </Form>
        </>
    )

}

export default Login;