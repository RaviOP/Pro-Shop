import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";

const PlaceOrderScreen = ({ history }) => {
	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);

	let addDecimal = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2);
	};

	//Price Calculations
	cart.itemsPrice = cart.cartItems.reduce((acc, curr) => acc + curr.price * curr.qty, 0);
	cart.shippingPrice = cart.itemsPrice > 100 ? 0 : 10;
	cart.taxPrice = addDecimal(Number((0.15 * cart.itemsPrice).toFixed(2)));

	cart.totalPrice = (
		Number(cart.itemsPrice) +
		Number(cart.shippingPrice) +
		Number(cart.taxPrice)
	).toFixed(2);

	const orderCreate = useSelector((state) => state.orderCreate);
	const { order, success, error, loading } = orderCreate;

	useEffect(() => {
		if (success) {
			history.push(`/order/${order._id}`);
		}
		// eslint-disable-next-line
	}, [history, success]);

	const placeOrderHandler = () => {
		dispatch(
			createOrder({
				orderItems: cart.cartItems,
				shippingAddress: cart.shippingAddress,
				paymentMethod: cart.paymentMethod,
				itemsPrice: cart.itemsPrice,
				shippingPrice: cart.shippingPrice,
				taxPrice: cart.taxPrice,
				totalPrice: cart.totalPrice,
			})
		);
	};
	return (
		<>
			<CheckoutSteps step1 step2 step3 step4 />
			<Row className='pt-2'>
				<Col md={8}>
					<ListGroup variant='flush'>
						<ListGroup.Item>
							<span className='heading'>Shipping</span>
							<p>
								<strong>Address : </strong>
								{cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
								{cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<span className='heading'>Payment Method</span>
							<p>
								<strong>Method : </strong> {cart.paymentMethod}
							</p>
						</ListGroup.Item>
						<ListGroup.Item>
							<span className='heading'>Order Items</span>
							{cart.cartItems.length === 0 ? (
								<Message>Your Cart Is Empty</Message>
							) : (
								<ListGroup variant='flush'>
									{cart.cartItems.map((item) => (
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
									<Col>${cart.itemsPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>
										<strong>Shipping</strong>
									</Col>
									<Col>${cart.shippingPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>
										<strong>Tax</strong>
									</Col>
									<Col>${cart.taxPrice}</Col>
								</Row>
							</ListGroup.Item>
							<ListGroup.Item>
								<Row>
									<Col>
										<strong>Total</strong>
									</Col>
									<Col>${cart.totalPrice}</Col>
								</Row>
							</ListGroup.Item>
							{error ? (
								<ListGroup.Item>
									<Message variant='danger' children={error} />
								</ListGroup.Item>
							) : null}
							{loading && (
								<ListGroup.Item>
									<Loader />
								</ListGroup.Item>
							)}
							<ListGroup.Item>
								<div>
									<Button
										className='w-100'
										disabled={cart.cartItems === 0}
										onClick={placeOrderHandler}
									>
										Place Order
									</Button>
								</div>
							</ListGroup.Item>
						</ListGroup>
					</Card>
				</Col>
			</Row>
		</>
	);
};

export default PlaceOrderScreen;
