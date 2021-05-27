import React, { useState } from "react";
import { Alert } from "react-bootstrap";

const Message = ({ variant, children }) => {
	const [show, setShow] = useState(true);
	return (
		<Alert
			variant={variant}
			show={show}
			onClick={() => setShow(false)}
			style={{ cursor: "pointer" }}
		>
			{children}
		</Alert>
	);
};

Message.defaultProps = {
	variant: "info",
};

export default Message;
