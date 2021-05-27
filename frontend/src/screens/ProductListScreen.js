import React, { useEffect } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useDispatch, useSelector } from "react-redux";

import { listProducts, deleteProduct, createProduct } from "../actions/productActions";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Paginate from "../components/Paginate";

const ProductListScreen = ({ history, match }) => {
	const pageNumber = match.params.pageNumber || 1;
	const dispatch = useDispatch();

	const productList = useSelector((state) => state.productList);
	const { loading, error, products, pages, page } = productList;

	const productDelete = useSelector((state) => state.productDelete);
	const { loading: loadingDelete, error: errorDelete, success } = productDelete;

	const productCreate = useSelector((state) => state.productCreate);
	const {
		loading: loadingCreate,
		error: errorCreate,
		success: successCreate,
		product: createdProduct,
	} = productCreate;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	useEffect(() => {
		dispatch({ type: PRODUCT_CREATE_RESET });
		if (!userInfo.isAdmin) {
			history.push("/");
		}
		if (successCreate) {
			history.push(`/admin/product/edit/${createdProduct._id}`);
		} else {
			dispatch(listProducts("", pageNumber));
		}
	}, [dispatch, userInfo, history, success, successCreate, createdProduct, pageNumber]);

	const deleteHandler = (id) => {
		if (window.confirm("Are You Sure?")) {
			//Delete Products
			dispatch(deleteProduct(id));
		}
	};

	const createProductHandler = () => {
		dispatch(createProduct());
	};

	return (
		<>
			<Row className='align-items-center'>
				<Col>
					<h2>Products</h2>
				</Col>
				<Col className='text-end'>
					<Button className='my-3' onClick={createProductHandler}>
						<i className='fas fa-plus'></i> Create Product
					</Button>
				</Col>
			</Row>
			{loadingCreate && <Loader />}
			{errorCreate && <Message variant='danger' children={errorCreate} />}
			{loadingDelete && <Loader />}
			{errorDelete && <Message variant='danger' children={errorDelete} />}
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
							<th>PRICE</th>
							<th>CATEGORY</th>
							<th>BRAND</th>
							<th>ACTIONS</th>
						</tr>
					</thead>
					<tbody className='text-center'>
						{products.map((product) => (
							<tr key={product._id}>
								<td>{product._id}</td>
								<td>{product.name}</td>
								<td>${product.price}</td>
								<td>{product.category}</td>
								<td>{product.brand}</td>
								<td>
									<LinkContainer to={`/admin/product/edit/${product._id}`}>
										<Button variant='light' className='btn-sm'>
											<i className='fas fa-edit'></i>
										</Button>
									</LinkContainer>
									<Button
										variant='danger'
										className='btn-sm'
										onClick={() => deleteHandler(product._id)}
									>
										<i className='fas fa-trash'></i>
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</Table>
			)}
			<div className='d-flex justify-content-center'>
				<Paginate pages={pages} page={page} isAdmin={true} />
			</div>
		</>
	);
};

export default ProductListScreen;
