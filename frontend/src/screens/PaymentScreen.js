import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../actions/cartActions";

const PaymentScreen = ({ history }) => {
	const cart = useSelector((state) => state.cart);
	const { shippingAddress } = cart;

	if (!shippingAddress) {
		history.push("/shipping");
	}

	const [paymentMethod, setPaymentMethod] = useState("PayPal");

	const dispatch = useDispatch();

	const submitHandler = (e) => {
		e.preventDefault();
		dispatch(savePaymentMethod(paymentMethod));
		history.push("/placeorder");
	};

	return (
		<>
			<CheckoutSteps step1 step2 step3 />
			<FormContainer>
				<div className='py-5'>
					<span className='heading'>Payment Method</span>
					<Form onSubmit={submitHandler}>
						<Form.Group>
							<Col>
								<Form.Check
									type='radio'
									label='PayPal or Credit Card'
									id='PayPal'
									name='paymentMethod'
									value='PayPal'
									checked
									onChange={(e) => setPaymentMethod(e.target.value)}
								></Form.Check>
							</Col>
						</Form.Group>
						<div className='text-center mt-3'>
							<Button type='submit' variant='primary'>
								Continue
							</Button>
						</div>
					</Form>
				</div>
			</FormContainer>
		</>
	);
};

export default PaymentScreen;
