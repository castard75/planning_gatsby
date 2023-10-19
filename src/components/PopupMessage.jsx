import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledPopup = styled.div`
	position: fixed;
	z-index: 9999;
	bottom: ${({ isOpen }) => (isOpen ? 'calc(0% + 20px)' : 'calc(-100%)')};
	right: 20px;
	border-radius: 4px;
	background-color: ${({ theme }) => theme.darkPurple};
	color: ${({ theme }) => theme.white};
	padding: 20px;
	text-align: center;
	transition: bottom 0.9s ease-in-out;

	@media print {
		display: none !important;
	}
`;

const PopupMessage = props => {
	const [message, setMessage] = useState(props.message);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		props.message && setMessage(props.message);
		props.message && setOpen(true);

		const timeout = setTimeout(() => {
			setOpen(false);
			setTimeout(() => setMessage(false), 500);
		}, 8000);
		return () => clearTimeout(timeout);
	}, [props.message]);

	return <StyledPopup isOpen={open}>{message}</StyledPopup>;
};

export default PopupMessage;
