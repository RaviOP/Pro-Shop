import React, { useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { listOrders } from "../actions/orderActions";
import Message from "../components/Message";
import Loader from "../components/Loader";

const OrderListScreen = ({ history }) => {
	const dispatch = useDispatch();
	const orderList = useSelector((state) => state.orderList);
	const { loading, error, orders } = orderList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listOrders());
		} else {
			history.push("/");
		}
	}, [dispatch, userInfo, history]);

	return (
		<>
			<span className='heading'>Orders</span>
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger'>{error}</Message>
			) : (
				<Table striped bordered hover responsive className='table-sm'>
					<thead>
						<tr className='text-center'>
							<th>ID</th>
							<th>USER</th>
							<th>DATE</th>
							<th>TOTAL</th>
							<th>PAID</th>
							<th>DELIVERED</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody className='text-center'>
						{orders.map((o) => (
							<tr key={o._id}>
								<td>{o._id}</td>
								<td>{o.user && o.user.name}</td>
								<td>{o.createdAt.substring(0, 10)}</td>
								<td>${o.totalPrice}</td>
								<td>
									{o.isPaid ? (
										o.paidAt.substring(0, 10)
									) : (
										<i className='fas fa-times' style={{ color: "red" }}></i>
									)}
								</td>
								<td>
									{o.isDelivered ? (
										o.deliveredAt.substring(0, 10)
									) : (
										<i className='fas fa-times' style={{ color: "red" }}></i>
									)}
								</td>
								<td>
									<LinkContainer to={`/admin/order/${o._id}`}>
										<Button variant='light' className='btn-sm'>
											Details
										</Button>
									</LinkContainer>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
		</>
	);
};

export default OrderListScreen;
