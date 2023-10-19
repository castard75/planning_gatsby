import React, { memo } from 'react';
import styled from 'styled-components';

const StyledPopup = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background-color: rgba(0, 0, 0, 0.5);
	display: flex;
	justify-content: center;
	align-items: center;

	opacity: ${props => (props.isOpen ? 1 : 0)} !important;
	pointer-events: ${props => (props.isOpen ? 'all' : 'none')};
	z-index: ${props => (props.isOpen ? 9999 : -1)};
	transition: opacity 0.3s ease-in-out;

	> div {
		transform: ${props => (props.isOpen ? 'translateY(0)' : 'translateY(-100%)')} !important;
		background-color: ${props => props.theme.white};
		padding: 20px;
		border-radius: 5px;
		box-shadow: 0px 0px 20px rgba(0, 38, 66, 0.3);
		max-width: 500px;
		width: 100%;
		max-height: 100%;
		overflow-y: auto;
		transition: transform 0.3s ease-in-out;

		.col_mp {
			padding: 20px 0;
			border-radius: 5px;
			transition: background 0.2s ease, color 0.2s ease;

			&:hover {
				background-color: ${props => props.theme.purple};
			}
		}

		.selected_date_mp {
			color: ${props => props.theme.purple};
			font-size: ${props => props.theme.texteNormal};
			background-color: transparent !important;
		}
	}

	@media print {
		display: none !important;
	}
`;

const Popup = memo(props => {
	const _onHeaderClick = event => {
		event.preventDefault();
		if (event.target === event.currentTarget && !props.preventClosing) {
			props.closeIsOpen();
		}
	};

	return (
		<StyledPopup isOpen={props.isOpen} onClick={_onHeaderClick}>
			<div>{props.children}</div>
		</StyledPopup>
	);
});

export default Popup;
