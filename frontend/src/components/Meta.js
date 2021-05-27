import React from "react";
import { Helmet } from "react-helmet";

export const Meta = ({ title }) => {
	return (
		<Helmet>
			<title>{title}</title>
		</Helmet>
	);
};
