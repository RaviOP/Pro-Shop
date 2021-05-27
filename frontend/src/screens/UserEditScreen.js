import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { getUserDetail, updateUser } from "../actions/userActions";
import { USER_UPDATE_RESET } from "../constants/userConstants";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";

const UserEditScreen = ({ match, history }) => {
	const userId = match.params.id;

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [isAdmin, setIsAdmin] = useState(false);

	const dispatch = useDispatch();

	const userDetails = useSelector((state) => state.userDetails);
	const { loading, error, user } = userDetails;

	const userUpdate = useSelector((state) => state.userUpdate);
	const { loading: loadingUpdate, error: errorUpdate, success } = userUpdate;

	useEffect(() => {
		if (success) {
			dispatch({ type: USER_UPDATE_RESET });
			history.push("/admin/userlist");
		} else if (!user.name || user._id !== userId) {
			dispatch(getUserDetail(userId));
		} else {
			setName(user.name);
			setEmail(user.email);
			setIsAdmin(user.isAdmin);
		}
	}, [user, dispatch, userId, success, history]);

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(updateUser({ _id: userId, name, email, isAdmin }));
	};

	return (
		<div>
			<Link to='/admin/userlist' className='btn btn-light border'>
				GO BACK
			</Link>
			<FormContainer>
				<span className='heading'>EDIT USER</span>
				{loadingUpdate && <Loader />}
				{errorUpdate && <Message variant='danger' children={errorUpdate} />}
				{loading ? (
					<Loader />
				) : error ? (
					<Message variant='danger'>{error}</Message>
				) : (
					<Form onSubmit={submitHandler}>
						<Form.Group controlId='name'>
							<Form.Label>Name</Form.Label>
							<Form.Control
								type='text'
								placeholder='Name'
								value={name}
								onChange={(e) => setName(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group controlId='email'>
							<Form.Label>Email Address</Form.Label>
							<Form.Control
								type='email'
								placeholder='Email'
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></Form.Control>
						</Form.Group>
						<Form.Group controlId='isAdmin' className='my-2'>
							<Form.Check
								label='Is Admin'
								type='checkbox'
								checked={isAdmin}
								onChange={(e) => setIsAdmin(e.target.checked)}
							></Form.Check>
						</Form.Group>
						<div className='text-center mt-3'>
							<Button type='submit' variant='primary'>
								Update
							</Button>
						</div>
					</Form>
				)}
			</FormContainer>
		</div>
	);
};

export default UserEditScreen;
