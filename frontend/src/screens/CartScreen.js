import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, ListGroup, Image, Form, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../actions/cartActions";

const CartScreen = ({ match, location, history }) => {
	const productId = match.params.id;
	const qty = location.search ? Number(location.search.split("=")[1]) : 1;

	const dispatch = useDispatch();

	const cart = useSelector((state) => state.cart);
	const { cartItems } = cart;

	useEffect(() => {
		if (productId) {
			dispatch(addToCart(productId, qty));
		}
	}, [dispatch, productId, qty]);

	const removeFromCartHandler = (id) => {
		dispatch(removeFromCart(id));
	};

	const checkoutHandler = () => {
		history.push("/login?redirect=shipping");
	};

	return (
		<>
			{cartItems.length === 0 ? (
				<div className='empty-cart'>
					<div className='container mx-auto text-center'>
						<h1 className='my-2 empty-cart-heading'>Cart Empty 😞 </h1>
						<p className='text-muted'>
							You Probably Haven't Ordered a Product Yet.
							<br />
							To Order a Product,Go To Main Page
						</p>
						<div className='empty-cart-image'>
							<img
								className='img-fluid'
								src={"/images/empty-cart.png"}
								alt='Empty-Cart'
							/>
						</div>
						<div className='mt-5'>
							<Link to='/' className='px-4 py-2 rounded-pill btn btn-dark'>
								Go Back
							</Link>
						</div>
					</div>
				</div>
			) : (
				<Row>
					<Col md={8}>
						<h2 className='text-center pb-5'>Shopping Cart</h2>
						<ListGroup variant='flush'>
							{cartItems.map((item) => (
								<ListGroup.Item key={item.product} className='list'>
									<Row>
										<Col md={2}>
											<div className='text-center'>
												<Image
													className='image'
													src={item.image}
													alt={item.name}
													fluid
													rounded
												/>
											</div>
										</Col>
										<Col md={4}>
											<Link
												to={`/product/${item.product}`}
												style={{
													textDecoration: "none",
													fontWeight: "bold",
												}}
											>
												{item.name}
											</Link>
										</Col>
										<Col md={2}>${item.price}</Col>
										<Col md={2}>
											<Form.Control
												as='select'
												value={item.qty}
												onChange={(e) =>
													dispatch(
														addToCart(
															item.product,
															Number(e.target.value)
														)
													)
												}
											>
												{[...Array(item.countInStock).keys()].map((x) => (
													<option key={x + 1} value={x + 1}>
														{x + 1}
													</option>
												))}
											</Form.Control>
										</Col>
										<Col md={2}>
											<Button
												type='button'
												variant='light'
												onClick={() => removeFromCartHandler(item.product)}
											>
												<i className='fas fa-trash'></i>
											</Button>
										</Col>
									</Row>
								</ListGroup.Item>
							))}
						</ListGroup>
					</Col>
					<Col md={4}>
						<Card>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h3 className='text-center'>Total</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									{cartItems.map((item) => (
										<div className='text-center'>
											<span>${item.price}</span> × <span>{item.qty}</span> =
											<span> ${(item.price * item.qty).toFixed(2)}</span>
											<br />
										</div>
									))}
								</ListGroup.Item>
								<ListGroup.Item className='text-center'>
									<span>
										<strong>SubTotal</strong> :{" "}
										{cartItems.reduce((acc, item) => acc + item.qty, 0)} × items
										= $
										{cartItems
											.reduce((acc, item) => acc + item.qty * item.price, 0)
											.toFixed(2)}
									</span>
								</ListGroup.Item>
								<ListGroup.Item className='text-center'>
									<Button
										type='button'
										className='btn-dark'
										disabled={cartItems.length === 0}
										onClick={checkoutHandler}
									>
										Proceed to Checkout
									</Button>
								</ListGroup.Item>
							</ListGroup>
						</Card>
					</Col>
				</Row>
			)}
		</>
	);
};

export default CartScreen;
