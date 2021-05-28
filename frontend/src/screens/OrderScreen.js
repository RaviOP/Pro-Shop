import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { PayPalButton } from "react-paypal-button-v2";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { getOrderDetails, payOrder, deliverOrder } from "../actions/orderActions";
import { ORDER_PAY_RESET, ORDER_DELIVER_RESET } from "../constants/orderConstants";

const OrderScreen = ({ match, history }) => {
	const orderId = match.params.id;
	const [sdkReady, setSdkReady] = useState(false);
	const dispatch = useDispatch();

	const orderDetails = useSelector((state) => state.orderDetails);
	const { order, loading, error } = orderDetails;

	const orderPay = useSelector((state) => state.orderPay);
	const { loading: loadingPay, success: successPay } = orderPay;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const orderDeliver = useSelector((state) => state.orderDeliver);
	const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

	if (!loading) {
		order.itemsPrice = order.orderItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
	}

	useEffect(() => {
		if (!userInfo) {
			history.push("/");
		}
		const addPaypalSript = async () => {
			const { data: clientId } = await axios.get("/api/config/paypal");
			const script = document.createElement("script");
			script.type = "text/javascript";
			script.async = true;
			script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
			script.onload = () => {
				setSdkReady(true);
			};
			document.body.appendChild(script);
		};
		if (!order || successPay || successDeliver) {
			dispatch({ type: ORDER_PAY_RESET });
			dispatch({ type: ORDER_DELIVER_RESET });
			dispatch(getOrderDetails(orderId));
		} else if (!order.isPaid) {
			if (!window.paypal) {
				addPaypalSript();
			} else {
				setSdkReady(true);
			}
		}
	}, [dispatch, orderId, successPay, order, successDeliver, history, userInfo]);

	const successPaymentHandler = (paymentResult) => {
		dispatch(payOrder(orderId, paymentResult));
	};

	const deliverHandler = () => {
		dispatch(deliverOrder(orderId));
	};

	return loading ? (
		<Loader />
	) : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<>
			<div className='d-flex flex-row align-items-center'>
				<div className='order flex-grow-1'>Order</div>
				<div className='orderId'>{orderId}</div>
			</div>
			<hr />
			<Row className='pt-2'>
				<Col md={8} className='border'>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<span className='heading'>Shipping</span>
							<p>
								<strong>Name : </strong>
								{order.user.name}
							</p>
							<p>
								<strong>Email : </strong>
								<a
									href={`mailto:${order.user.email}`}
									style={{ textDecoration: "none" }}
								>
									{order.user.email}
								</a>
							</p>
							<p>
								<strong>Address : </strong>
								{order.shippingAddress.address}, {order.shippingAddress.city}{" "}
								{order.shippingAddress.postalCode}, {order.shippingAddress.country}
							</p>
							{order.isDelivered ? (
								<Message variant='success'>
									Delivered on {order.deliveredAt.substring(0, 10)}
								</Message>
							) : (
								<Message variant='danger'>Not Delivered</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<span className='heading'>Payment Method</span>
							<p>
								<strong>Method : </strong> {order.paymentMethod}
							</p>
							{order.isPaid ? (
								<Message variant='success'>
									Paid on {order.paidAt.substring(0, 10)}
								</Message>
							) : (
								<Message variant='danger'>Not Paid</Message>
							)}
						</ListGroup.Item>
						<ListGroup.Item>
							<span className='heading'>Order Items</span>
							{order.orderItems.length === 0 ? (
								<Message>Order Is Empty</Message>
							) : (
								<ListGroup variant='flush'>
									{order.orderItems.map((item) => (
										<ListGroup.Item key={item.product}>
											<Row>
												<Col md={2}>
													<Image
														src={item.image}
														alt={item.name}
														fluid
														rounded
													/>
												</Col>
												<Col md={5}>
													<Link
														style={{ textDecoration: "none" }}
														to={`/product/${item.product}`}
														target='_blank'
													>
														{item.name}
													</Link>
												</Col>
												<Col md={5}>
													{item.qty} x ${item.price.toFixed(2)} = $
													{(item.qty * item.price).toFixed(2)}
												</Col>
											</Row>
										</ListGroup.Item>
									))}
								</ListGroup>
							)}
						</ListGroup.Item>
					</ListGroup>
				</Col>
				<Col md={4}>
					<Card>
						<ListGroup variant='flush'>
							<ListGroup.Item>
								<h3 className='text-center'>Order Summary</h3>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>
										<strong>Items</strong>
									</Col>
									<Col>${order.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>
										<strong>Shipping</strong>
									</Col>
									<Col>${order.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>
										<strong>Tax</strong>
									</Col>
									<Col>${order.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>
										<strong>Total</strong>
									</Col>
									<Col>${order.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{!order.isPaid && (
								<ListGroup.Item>
									{loadingPay && <Loader />}
									{!sdkReady ? (
										<Loader />
									) : (
										<PayPalButton
											amount={order.totalPrice}
											onSuccess={successPaymentHandler}
										/>
									)}
								</ListGroup.Item>
							)}
							{userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
								<ListGroup.Item>
									<button
										type='button'
										className='btn btn-block btn-outline-success w-100'
										onClick={deliverHandler}
									>
										{loadingDeliver ? <Loader /> : "Mark as Delivered"}
									</button>
								</ListGroup.Item>
							)}
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default OrderScreen;
