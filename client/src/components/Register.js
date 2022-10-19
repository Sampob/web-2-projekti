import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import {useEffect, useState} from "react";
import axios from "axios";
import {Modal} from "react-bootstrap";

const Register = (props) => {

    const [formUsername, changeFormUsername] = useState('');
    const [formEmail, changeFormEmail] = useState('');
    const [formPassword, changeFormPassword] = useState('');
    const [successModal, changeSuccessModal] = useState(false);

    const [usernameError, changeUsernameError] = useState(false);
    const [emailError, changeEmailError] = useState(false);
    const [emailErrorText, changeEmailErrorText] = useState('');
    const [passwordError, changePasswordError] = useState(false);
    const [passwordErrorText, changePasswordErrorText] = useState('');

    const handleUsername = (event) => {
        changeFormUsername(event.target.value);
        changeUsernameError(false);
        changeEmailError(false);
        changePasswordError(false);
    }
    const handleEmail = (event) => {
        changeFormEmail(event.target.value);
        changeUsernameError(false);
        changeEmailError(false);
        changePasswordError(false);
    }
    const handlePassword = (event) => {
        changeFormPassword(event.target.value);
        changeUsernameError(false);
        changeEmailError(false);
        changePasswordError(false);
    }

    const showSuccessModal = () => changeSuccessModal(true);
    const closeSuccessModal = () => {
        changeFormUsername('');
        changeFormEmail('');
        changeFormPassword('');
        changeSuccessModal(false);
        props.tab("login");
    }

    useEffect(() => {
        if (props.activeTab !== "register") cleanup();
    });

    const validate = () => {
        let returnValue = true;
        const regex =
            /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i;
        if (formEmail === '' || !regex.test(formEmail)) {
            changeEmailError(true);
            changeEmailErrorText("Invalid Email");
            returnValue = false;
        }
        if (formUsername === '') {
            changeUsernameError(true);
            returnValue = false;
        }
        if (formPassword === '') {
            changePasswordError(true);
            changePasswordErrorText("Field required");
            returnValue = false;
        }

        return returnValue;
    }

    const newUser = (e) => {
        try {
            e.preventDefault();
        } catch {

        }

        if (validate()) {
            axios
                .post('http://localhost:5000/newUser', {
                    username: formUsername,
                    email: formEmail,
                    password: formPassword
                }).then(() => showSuccessModal())
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
        changeFormUsername('');
        changeFormEmail('');
        changeFormPassword('');
        changeUsernameError(false);
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
                    <Modal.Title>User created</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>Hello {formUsername}, you can now log in.</p>
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
                    <Form.FloatingLabel style={errorStyle} hidden={!usernameError} label="Field required"/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        placeholder="Email"
                        value={formEmail}
                        onChange={handleEmail}
                    />
                    <Form.FloatingLabel style={errorStyle} hidden={!emailError} label={emailErrorText}/>
                </Form.Group>

                <Form.Group className="mb-3" controlId="loginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        value={formPassword}
                        onChange={handlePassword}
                    />
                    <Form.FloatingLabel style={errorStyle} hidden={!passwordError} label={passwordErrorText}/>
                </Form.Group>
                <Button variant="success" type="submit">Register</Button>
            </Form>
        </>
    )


}

export default Register;