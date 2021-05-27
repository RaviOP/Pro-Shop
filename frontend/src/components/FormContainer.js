import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const FormContainer = ({ children }) => {
	return (
		<Container>
			<Row className='full-screen justify-content-md-center align-content-center'>
				<Col xs={12} md={6} lg={4} className='border border-2 rounded-2 p-3'>
					{children}
				</Col>
			</Row>
		</Container>
	);
};

export default FormContainer;
