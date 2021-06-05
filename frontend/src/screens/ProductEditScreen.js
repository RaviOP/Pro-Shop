import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import { productDetailsList, updateProduct } from "../actions/productActions";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { PRODUCT_DETAILS_RESET, PRODUCT_UPDATE_RESET } from "../constants/productConstants";

const ProductEditScreen = ({ match, history }) => {
	const productId = match.params.id;

	const inputFile = useRef();

	const [name, setName] = useState("");
	const [price, setPrice] = useState(0);
	const [image, setImage] = useState("");
	const [brand, setBrand] = useState("");
	const [category, setCategory] = useState("");
	const [countInStock, setCountInStock] = useState(0);
	const [description, setDescription] = useState("");
	const [uploading, setUploading] = useState(false);

	const dispatch = useDispatch();

	const productDetail = useSelector((state) => state.productDetail);
	const { loading, error, product } = productDetail;

	const productUpdate = useSelector((state) => state.productUpdate);
	const { loading: loadingUpdate, error: errorUpdate, success: successUpdate } = productUpdate;

	useEffect(() => {
		if (successUpdate) {
			dispatch({ type: PRODUCT_UPDATE_RESET });
			dispatch({ type: PRODUCT_DETAILS_RESET });
			history.push("/admin/productlist");
		} else if (!product.name || product._id !== productId) {
			dispatch(productDetailsList(productId));
		} else {
			setName(product.name);
			setPrice(product.price);
			setImage(product.image);
			setBrand(product.brand);
			setCategory(product.category);
			setDescription(product.description);
			setCountInStock(product.countInStock);
		}
	}, [product, dispatch, productId, history, successUpdate]);

	const submitHandler = (e) => {
		e.preventDefault();
		//Update Product
		dispatch(
			updateProduct({
				_id: productId,
				name,
				price,
				brand,
				image,
				category,
				description,
				countInStock,
			})
		);
	};

	const uploadFileHandler = async (e) => {
		const file = e.target.files[0];
		const formData = new FormData();
		formData.append("image", file);
		setUploading(true);

		try {
			const config = {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			};
			const { data } = await axios.post("/api/products/upload", formData, config);

			setImage(data);
			setUploading(false);
		} catch (error) {
			console.log(error);
			setUploading(true);
		}
	};

	return (
		<div>
			<Link to='/admin/productlist' className='btn btn-light border'>
				GO BACK
			</Link>
			<Row className='justify-content-md-center mt-3'>
				<Col md={6} xl={4} className='border px-3 py-4 '>
					<span className='heading'>EDIT PRODUCT</span>
					{loadingUpdate && <Loader />}
					{errorUpdate && <Message variant='danger' children={errorUpdate} />}
					{loading ? (
						<Loader />
					) : error ? (
						<Message variant='danger'>{error}</Message>
					) : (
						<Form onSubmit={submitHandler}>
							<Form.Group controlId='name'>
								<Form.Label>Name</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Name'
									value={name}
									onChange={(e) => setName(e.target.value)}
								></Form.Control>
							</Form.Group>
							<Form.Group controlId='price'>
								<Form.Label>Price</Form.Label>
								<Form.Control
									type='number'
									placeholder='Enter Price'
									value={price}
									onChange={(e) => setPrice(e.target.value)}
								></Form.Control>
							</Form.Group>
							<Form.Group controlId='image' className>
								<Form.Label>Image</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Image URL'
									value={image}
									onChange={(e) => setImage(e.target.value)}
								></Form.Control>
								<div className='text-center py-2'>
									<input
										type='file'
										onChange={uploadFileHandler}
										ref={inputFile}
										style={{ display: "none" }}
									/>
									<button
										type='button'
										className='btn  btn-outline-secondary'
										onClick={() => inputFile.current.click()}
									>
										Choose Image
									</button>
								</div>
								{uploading && <Loader />}
							</Form.Group>

							<Form.Group controlId='brand'>
								<Form.Label>Brand</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Brand'
									value={brand}
									onChange={(e) => setBrand(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId='countInStock'>
								<Form.Label>Count In Stock</Form.Label>
								<Form.Control
									type='number'
									placeholder='Enter Count In Stock'
									value={countInStock}
									onChange={(e) => setCountInStock(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId='category'>
								<Form.Label>Category</Form.Label>
								<Form.Control
									type='text'
									placeholder='Enter Category'
									value={category}
									onChange={(e) => setCategory(e.target.value)}
								></Form.Control>
							</Form.Group>

							<Form.Group controlId='description'>
								<Form.Label>Description</Form.Label>
								<textarea
									placeholder='Enter Description'
									className='form-control'
									rows='5'
									value={description}
									onChange={(e) => setDescription(e.target.value)}
								></textarea>
							</Form.Group>
							<div className='text-center mt-3'>
								<Button type='submit' variant='primary'>
									Update
								</Button>
							</div>
						</Form>
					)}
				</Col>
			</Row>
		</div>
	);
};

export default ProductEditScreen;
