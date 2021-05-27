import {
	PRODUCT_DELETE_FAIL,
	PRODUCT_DELETE_REQUEST,
	PRODUCT_DELETE_SUCCESS,
	PRODUCT_DETAILS_FAIL,
	PRODUCT_DETAILS_REQUEST,
	PRODUCT_DETAILS_SUCCESS,
	PRODUCT_LIST_FAIL,
	PRODUCT_LIST_REQUEST,
	PRODUCT_LIST_SUCCESS,
	PRODUCT_CREATE_FAIL,
	PRODUCT_CREATE_REQUEST,
	PRODUCT_CREATE_SUCCESS,
	PRODUCT_UPDATE_FAIL,
	PRODUCT_UPDATE_REQUEST,
	PRODUCT_UPDATE_SUCCESS,
	PRODUCT_CREATE_REVIEW_FAIL,
	PRODUCT_CREATE_REVIEW_REQUEST,
	PRODUCT_CREATE_REVIEW_SUCCESS,
	PRODUCT_TOP_FAIL,
	PRODUCT_TOP_REQUEST,
	PRODUCT_TOP_SUCCESS,
} from "../constants/productConstants";
import axios from "axios";

export const listProducts =
	(keyword = "", pageNumber) =>
	async (dipatch) => {
		try {
			dipatch({ type: PRODUCT_LIST_REQUEST });
			const { data } = await axios.get(
				`/api/products?keyword=${keyword}&pageNumber=${pageNumber}`
			);
			if (data) {
				dipatch({ type: PRODUCT_LIST_SUCCESS, payload: data });
			}
		} catch (error) {
			dipatch({
				type: PRODUCT_LIST_FAIL,
				payload:
					error.response && error.response.data.message
						? error.response.data.message
						: error.message,
			});
		}
	};

export const productDetailsList = (id) => async (dipatch) => {
	try {
		dipatch({ type: PRODUCT_DETAILS_REQUEST });
		const { data } = await axios.get(`/api/products/${id}`);
		if (data) {
			dipatch({ type: PRODUCT_DETAILS_SUCCESS, payload: data });
		}
	} catch (error) {
		dipatch({
			type: PRODUCT_DETAILS_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const deleteProduct = (id) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_DELETE_REQUEST,
		});
		const { userLogin } = getState();
		const { userInfo } = userLogin;
		const config = {
			headers: {
				Authorization: userInfo.token,
			},
		};
		await axios.delete(`/api/products/${id}`, config);
		dispatch({
			type: PRODUCT_DELETE_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_DELETE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createProduct = () => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_CREATE_REQUEST,
		});
		const { userLogin } = getState();
		const { userInfo } = userLogin;
		const config = {
			headers: {
				Authorization: userInfo.token,
			},
		};
		const { data } = await axios.post(`/api/products`, {}, config);
		dispatch({
			type: PRODUCT_CREATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_CREATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const updateProduct = (product) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_UPDATE_REQUEST,
		});
		const { userLogin } = getState();
		const { userInfo } = userLogin;
		const config = {
			headers: {
				Authorization: userInfo.token,
			},
		};
		const { data } = await axios.put(`/api/products/${product._id}`, product, config);
		dispatch({
			type: PRODUCT_UPDATE_SUCCESS,
			payload: data,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_UPDATE_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const createProductReview = (productId, review) => async (dispatch, getState) => {
	try {
		dispatch({
			type: PRODUCT_CREATE_REVIEW_REQUEST,
		});
		const { userLogin } = getState();
		const { userInfo } = userLogin;
		const config = {
			headers: {
				Authorization: userInfo.token,
			},
		};
		await axios.post(`/api/products/${productId}/reviews`, review, config);
		dispatch({
			type: PRODUCT_CREATE_REVIEW_SUCCESS,
		});
	} catch (error) {
		dispatch({
			type: PRODUCT_CREATE_REVIEW_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};

export const listTopProducts = () => async (dipatch) => {
	try {
		dipatch({ type: PRODUCT_TOP_REQUEST });
		const { data } = await axios.get(`/api/products/top`);
		if (data) {
			dipatch({ type: PRODUCT_TOP_SUCCESS, payload: data });
		}
	} catch (error) {
		dipatch({
			type: PRODUCT_TOP_FAIL,
			payload:
				error.response && error.response.data.message
					? error.response.data.message
					: error.message,
		});
	}
};
