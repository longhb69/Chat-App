import { Container, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLogin } from "../LoginContext";
import { BaseUrl } from "../shared";
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [authInfo, setAuthInfo] = useLogin()
    const navigate = useNavigate()
    function login(e) {
        e.preventDefault();
        const url = BaseUrl + 'api/Account/login';
        axios.post(url, {
            username: username,
            password: password,
            remberMe: true,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);
            localStorage.setItem('userName', response.data.userName);
            setAuthInfo({
                loggedIn: true,
                userId: response.data.userId,
                userName: response.data.userName,
            })
            navigate("/");
        }).catch((e) => {
            if (e.response && (e.response.status === 401 || e.response.status === 400)) {
                console.log('Incorrect username or password');
            }
        });
    };

    return (
        <Container>
            <h3>Login</h3>
            <Form onSubmit={login}>
                <Form.Group controlId="formUsername">
                    <Form.Label>Username or Email:</Form.Label>
                    <Form.Control
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => { setUsername(e.target.value) }}
                        required
                    />
                </Form.Group>
                <Form.Group controlId="formPassword">
                    <Form.Label>Password:</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value) }}
                        required
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Login</Button>
            </Form>
        </Container>
    );
}