import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Image, Carousel } from "react-bootstrap";
import Message from "./Message";
import { listTopProducts } from "../actions/productActions";

const ProductCarousel = () => {
	const dispatch = useDispatch();

	const productTopRated = useSelector((state) => state.productTopRated);
	const { loading, error, products } = productTopRated;

	useEffect(() => {
		dispatch(listTopProducts());
	}, [dispatch]);

	return loading ? null : error ? (
		<Message variant='danger'>{error}</Message>
	) : (
		<Carousel pause='hover' className='bg-dark' interval={1000}>
			{products.map((product) => (
				<Carousel.Item key={product._id} className='text-center'>
					<Link to={`/product/${product._id}`}>
						<Image src={product.image} alt={product.name} fluid className='mt-5' />
						<Carousel.Caption className='carousel-caption'>
							<span className='heading'>
								{product.name} at ${product.price}
							</span>
						</Carousel.Caption>
					</Link>
				</Carousel.Item>
			))}
		</Carousel>
	);
};

export default ProductCarousel;
