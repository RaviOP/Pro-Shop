import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col, Image, ListGroup, Card, Form, Button } from "react-bootstrap";
import { productDetailsList, createProductReview } from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { Meta } from "../components/Meta";

const ProductScreen = ({ match, history }) => {
	const [qty, setQty] = useState(1);
	const [rating, setRating] = useState(0);
	const [comment, setComment] = useState("");

	const dispatch = useDispatch();

	const productDetail = useSelector((state) => state.productDetail);
	const { loading, error, product } = productDetail;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	const productReviewCreate = useSelector((state) => state.productReviewCreate);
	const { loading: loadingReview, error: errorProductReview, success } = productReviewCreate;

	useEffect(() => {
		if (success) {
			setRating(0);
			setComment("");
			dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
		}
		dispatch(productDetailsList(match.params.id));
	}, [dispatch, match, success]);

	const addToCartHandler = () => {
		history.push(`/cart/${match.params.id}?qty=${qty}`);
	};

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(createProductReview(match.params.id, { rating, comment }));
	};

	return (
		<>
			{loading || loadingReview ? (
				<Loader />
			) : error ? (
				<Message variant='danger' children={error} />
			) : (
				<>
					<Link to='/' className='btn btn-dark' style={{ textDecoration: "none" }}>
						&#8592; Go Back
					</Link>
					<hr />
					<Meta title={product.name} />
					<Row>
						<Col md={6}>
							<Image className='image' src={product.image} alt={product.name} fluid />
						</Col>
						<Col md={3}>
							<ListGroup variant='flush'>
								<ListGroup.Item>
									<h3>{product.name}</h3>
								</ListGroup.Item>
								<ListGroup.Item>
									<Rating
										value={product.rating}
										text={`${product.numReviews} reviews`}
									/>
								</ListGroup.Item>
								<ListGroup.Item>Price: ${product.price}</ListGroup.Item>
								<ListGroup.Item>Description: {product.description}</ListGroup.Item>
							</ListGroup>
						</Col>
						<Col md={3}>
							<Card>
								<ListGroup variant='flush'>
									<ListGroup.Item>
										<Row>
											<Col>Price :</Col>
											<Col>
												<strong>${product.price}</strong>
											</Col>
										</Row>
									</ListGroup.Item>
									<ListGroup.Item>
										<Row>
											<Col>Status :</Col>
											<Col>
												<strong>
													{product.countInStock > 0
														? "In Stock"
														: "Out of Stock"}
												</strong>
											</Col>
										</Row>
									</ListGroup.Item>
									{product.countInStock > 0 && (
										<ListGroup.Item>
											<Row>
												<Col>Qty</Col>
												<Col>
													<Form.Control
														as='select'
														value={qty}
														onChange={(e) => setQty(e.target.value)}
													>
														{[
															...Array(product.countInStock).keys(),
														].map((x) => (
															<option key={x + 1} value={x + 1}>
																{x + 1}
															</option>
														))}
													</Form.Control>
												</Col>
											</Row>
										</ListGroup.Item>
									)}
									<button
										onClick={addToCartHandler}
										className='btn btn-dark btn-block'
										disabled={product.countInStock === 0}
									>
										{product.countInStock > 0 ? "Add To Cart" : "Out of Stock"}
									</button>
								</ListGroup>
							</Card>
						</Col>
					</Row>
					<hr />
					<Row>
						<Col md={6}>
							<span className='heading'>Reviews</span>
							{product.reviews.length === 0 && <Message>No Reviews</Message>}
							<ListGroup variant='flush'>
								{product.reviews.map((review) => (
									<ListGroup.Item key={review._id}>
										<div className='d-flex flex-row'>
											<div className='flex-grow-1'>
												<strong>{review.name.toUpperCase()}</strong>
											</div>
											<div>{review.createdAt.substring(0, 10)}</div>
										</div>

										<Rating value={review.rating} />

										<div className='pt-1'>{review.comment}</div>
									</ListGroup.Item>
								))}
							</ListGroup>
						</Col>
						<Col md={6}>
							<span className='heading'>Write a Review</span>
							{errorProductReview && (
								<Message variant='danger'>{errorProductReview}</Message>
							)}
							{userInfo ? (
								<div>
									<Form onSubmit={submitHandler}>
										<Form.Group controlId='rating'>
											<Form.Label>Rating</Form.Label>
											<Form.Control
												as='select'
												value={rating}
												onChange={(e) => setRating(e.target.value)}
											>
												<option value=''>Select...</option>
												<option value='1'>1 - Poor</option>
												<option value='2'>2 - Fair</option>
												<option value='3'>3 - Good</option>
												<option value='4'>4 - Very Good</option>
												<option value='5'>5 - Excellent</option>
											</Form.Control>
										</Form.Group>
										<Form.Group controlId='comment'>
											<Form.Label>Comment</Form.Label>
											<Form.Control
												as='textarea'
												row='4'
												value={comment}
												onChange={(e) => setComment(e.target.value)}
											></Form.Control>
										</Form.Group>
										<div className='mt-2 text-center'>
											<Button type='submit' variant='primary'>
												Submit
											</Button>
										</div>
									</Form>
								</div>
							) : (
								<div>
									Please <Link to='/login'>Log In</Link> to write a review
								</div>
							)}
						</Col>
					</Row>
				</>
			)}
		</>
	);
};

export default ProductScreen;
