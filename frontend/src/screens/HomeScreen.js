import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import { listProducts } from "../actions/productActions";

import Product from "../components/Product";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Paginate from "../components/Paginate";
import ProductCarousel from "../components/ProductCarousel";
import { Meta } from "../components/Meta";

const HomeScreen = ({ match }) => {
	const keyword = match.params.keyword;
	const pageNumber = match.params.pageNumber || 1;

	const dispatch = useDispatch();
	const productList = useSelector((state) => state.productList);
	const { loading, error, products, page, pages } = productList;

	useEffect(() => {
		dispatch(listProducts(keyword, pageNumber));
	}, [dispatch, keyword, pageNumber]);

	return (
		<>
			<Meta title='Home' />
			{!keyword ? (
				<>
					<ProductCarousel />
					<hr />
				</>
			) : (
				<Link to='/' className='btn btn-dark' style={{ textDecoration: "none" }}>
					&#8592; Go Back
				</Link>
			)}
			{loading ? (
				<Loader />
			) : error ? (
				<Message variant='danger' children={error} />
			) : (
				<>
					<h2 className='text-center'>Latest Products</h2>
					<Row>
						{products.map((product) => (
							<Col key={product._id} sm={12} md={6} lg={4}>
								<Product product={product} />
							</Col>
						))}
					</Row>
					<div className='d-flex justify-content-center'>
						<Paginate pages={pages} page={page} keyword={keyword ? keyword : ""} />
					</div>
				</>
			)}
		</>
	);
};

export default HomeScreen;
