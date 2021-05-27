import React, { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { listUser, deleteUser } from "../actions/userActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

const UserListScreen = ({ history }) => {
	const dispatch = useDispatch();
	const userList = useSelector((state) => state.userList);
	const { loading, error, users } = userList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const userDelete = useSelector((state) => state.userDelete);
	const { success } = userDelete;

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listUser());
		} else {
			history.push("/");
		}
	}, [dispatch, userInfo, history, success]);

	const deleteHandler = (id) => {
		if (window.confirm("Are You Sure?")) {
			dispatch(deleteUser(id));
		}
	};
	return (
		<>
			<span className='heading'>Users</span>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr className='text-center'>
							<th>ID</th>
							<th>NAME</th>
							<th>EMAIL</th>
							<th>ADMIN</th>
							<th></th>
						</tr>
					</thead>
					<tbody className='text-center'>
						{users.map((user) => (
							<tr key={user._id}>
								<td>{user._id}</td>
								<td>{user.name}</td>
								<td>
									<a
										href={`mailto:${user.email}`}
										style={{ textDecoration: "none" }}
									>
										{user.email}
									</a>
								</td>
								<td>
									{user.isAdmin ? (
										<i className='fas fa-check' style={{ color: "green" }}></i>
									) : (
										<i className='fas fa-times' style={{ color: "red" }}></i>
									)}
								</td>
								<td>
									<LinkContainer to={`/admin/user/edit/${user._id}`}>
										<Button variant='light' className='btn-sm'>
											<i className='fas fa-edit'></i>
										</Button>
									</LinkContainer>
									<Button
										variant='danger'
										className='btn-sm'
										onClick={() => deleteHandler(user._id)}
									>
										<i className='fas fa-trash'></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default UserListScreen;
