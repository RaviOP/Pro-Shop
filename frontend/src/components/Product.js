import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import Rating from "./Rating";

const Product = ({ product }) => {
	return (
		<Card className='my-3 p-3 rounded'>
			<Link to={`/product/${product._id}`}>
				<Card.Img className='image' src={product.image} variant='top' />
			</Link>
			<Card.Body>
				<Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
					<Card.Text as='div'>
						<strong className='name'>{product.name}</strong>
					</Card.Text>
				</Link>

				<Card.Text as='div' className='pt-2'>
					<Rating value={product.rating} text={`${product.numReviews} reviews`} />
				</Card.Text>

				<Card.Text as='h3' className='pt-2'>
					${product.price}
				</Card.Text>
			</Card.Body>
		</Card>
	);
};

export default Product;
