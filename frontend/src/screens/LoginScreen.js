import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

const LoginScreen = ({ location, history }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const redirect = location.search ? location.search.split("=")[1] : "/";

	const dispatch = useDispatch();

	const user = useSelector((state) => state.userLogin);
	const { loading, error, userInfo } = user;

	useEffect(() => {
		if (userInfo) {
			history.push(redirect);
		}
	}, [history, userInfo, redirect]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(login(email.toLowerCase(), password));
	};

	return (
		<div>
			<FormContainer>
				<span className='heading'>Login</span>
				{error && <Message variant='danger'>{error}</Message>}
				{loading && <Loader />}
				<Form onSubmit={submitHandler}>
					<Form.Group controlId='email'>
						<Form.Label>Email Address</Form.Label>
						<Form.Control
							type='email'
							placeholder='Enter your Email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></Form.Control>
					</Form.Group>
					<Form.Group controlId='password'>
						<Form.Label>Password</Form.Label>
						<Form.Control
							type='password'
							placeholder='Enter your Password'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						></Form.Control>
					</Form.Group>
					<div className='text-center mt-3'>
						<Button type='submit' variant='primary'>
							Login
						</Button>
					</div>
				</Form>
				<Row className='py-3'>
					<Col className='text-center'>
						<Link
							style={{ textDecoration: "none" }}
							to={redirect ? `/register?redirect=${redirect}` : `/register`}
						>
							Don't Have an Account?
						</Link>
					</Col>
				</Row>
			</FormContainer>
		</div>
	);
};

export default LoginScreen;
