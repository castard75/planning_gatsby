import React from 'react';
import styled from 'styled-components';

import cancelIcon from '../images/icons/cancelIcon.svg';
import chronoIcon from '../images/icons/chronoIcon.svg';
import lieuxIcon from '../images/icons/lieuxIcon_black.svg';
import planningIcon from '../images/icons/planningIcon_black.svg';
import validIcon from '../images/icons/validIcon.svg';
import waitIcon from '../images/icons/waitIcon.svg';

const StyledEtiquette = styled.span`
	width: fit-content;
	cursor: ${props => (props.isEditable ? 'pointer' : 'default')};
	line-height: 1;
	font-family: 'Roboto', sans-serif;
	font-weight: ${props => (props.color ? props.theme.normalWeight : props.theme.lightWeight)};
	font-size: ${props => props.theme.texteNormal};
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	background-color: ${props => {
		switch (props.color) {
			case 'red':
				return props.theme.red;
			case 'green':
				return props.theme.green;
			case 'blue':
				return props.theme.blueLight;
			case 'yellow':
				return props.theme.yellow;
			case 'purple':
				return props.theme.purple;
			default:
				return props.theme.white;
		}
	}};
	color: ${props => (props.color ? props.theme.white : props.theme.black)};
	padding: 6px 14px;
	border-radius: ${props => (props.round ? '50px' : '5px')};

	span {
		line-height: 1;
	}

	img {
		position: relative;
		bottom: 1px;
		margin-right: 5px;
		width: 14px;
		height: 14px;
		object-fit: contain;
		filter: ${props =>
			props.color && (props.type === 'chrono' || props.type === 'lieux' || props.type === 'planning')
				? 'invert(1)'
				: 'none'};
	}
`;

const Etiquette = props => {
	let selectedImg = null;
	switch (props.type) {
		case 'cancel':
			selectedImg = cancelIcon;
			break;
		case 'valid':
			selectedImg = validIcon;
			break;
		case 'wait':
			selectedImg = waitIcon;
			break;
		case 'chrono':
			selectedImg = chronoIcon;
			break;
		case 'lieux':
			selectedImg = lieuxIcon;
			break;
		case 'planning':
			selectedImg = planningIcon;
			break;
		default:
			selectedImg = null;
			break;
	}

	return (
		<StyledEtiquette
			onClick={props.onClick}
			onDoubleClick={props.onDoubleClick}
			color={props.color}
			type={props.type}
			round={props.round}
			isEditable={props.isEditable}>
			{selectedImg && <img src={selectedImg} alt='Icon' />}
			<span>{props.value || props.children}</span>
		</StyledEtiquette>
	);
};

export default Etiquette;
