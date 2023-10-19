import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { updateAnimations } from '../context/slicers/animations';
import Etiquette from './Etiquette';
import { Select } from './Input';

const SpanStyle = styled.span`
	width: auto;
	cursor: ${props => (props.isEditable ? 'pointer' : 'default')};
	color: ${props => (props.white ? props.theme.white : props.theme.black)};
	padding: 0 5px 5px 5px;
`;

export const YesNoComp = props => {
	return (
		<Etiquette
			isEditable={props.isEditable}
			onDoubleClick={props.onDoubleClick}
			color={props.value ? 'green' : 'red'}
			value={props.value ? 'Oui' : 'Non'}
		/>
	);
};

export const ContratComp = props => {
	const stat = props.value === 'A faire' ? false : true;
	return (
		<Etiquette
			isEditable={props.isEditable}
			onDoubleClick={props.onDoubleClick}
			color={stat ? 'green' : 'red'}
			value={props.value}
		/>
	);
};

export const EtatComp = props => {
	const dispatch = useDispatch();
	const updateAnimationsAction = useCallback(
		(id, data) => dispatch(updateAnimations(id, data)),
		[dispatch]
	);
	const [edit, setEdit] = useState(false);

	const handleChange = useCallback(
		e => {
			setEdit(false);
			updateAnimationsAction(props.editable, { etat: e.target.value });
		},
		[props.editable, updateAnimationsAction]
	);

	if (edit) {
		return (
			<Select
				onChange={handleChange}
				options={[
					{ label: 'Facturé', value: 'Facturé' },
					{ label: 'Terminé', value: 'Terminé' },
					{ label: 'Validé', value: 'Validé' },
					{ label: 'En attente', value: 'En attente' },
					{ label: 'Annulé', value: 'Annulé' },
					{ label: 'Malade', value: 'Malade' },
					{ label: 'Absent', value: 'Absent' },
				]}
				defaultValue={props.value}
				isDetailBoard={props.isDetailBoard}
			/>
		);
	} else {
		switch (props.value) {
			case 'Facturé':
			case 'Terminé':
				return (
					<Etiquette
						isEditable={props.isEditable}
						round
						color='green'
						type='valid'
						value={props.value}
						onDoubleClick={() => props.editable && setEdit(true)}
					/>
				);

			case 'Validé':
				return (
					<Etiquette
						isEditable={props.isEditable}
						round
						color='blue'
						type='valid'
						value={props.value}
						onDoubleClick={() => props.editable && setEdit(true)}
					/>
				);

			case 'En attente':
				return (
					<Etiquette
						isEditable={props.isEditable}
						round
						color='yellow'
						type='wait'
						value={props.value}
						onDoubleClick={() => props.editable && setEdit(true)}
					/>
				);

			case 'Annulé':
			case 'Malade':
			case 'Absent':
				return (
					<Etiquette
						isEditable={props.isEditable}
						round
						color='red'
						type='cancel'
						value={props.value}
						onDoubleClick={() => props.editable && setEdit(true)}
					/>
				);
			default:
				return null;
		}
	}
};

export const ColorComp = props => {
	const dispatch = useDispatch();
	const updateAnimationsAction = useCallback(
		(id, data) => dispatch(updateAnimations(id, data)),
		[dispatch]
	);

	const [color, setcolor] = useState(props.initialValue);

	const handleColorChange = () => {
		const colorValue =
			props.initialValue === '' ? 'yellow' : props.initialValue === 'yellow' ? 'green' : '';
		setcolor(colorValue);
		updateAnimationsAction(props.id, { color_animateur: colorValue });
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (props.initialValue !== color) setcolor(props.initialValue);
		});
		return () => clearTimeout(timeout);
	}, [props.initialValue]);

	return (
		<Etiquette
			isEditable={props.isEditable || (!props.isEditable && props.id)}
			onDoubleClick={props.onDoubleClick}
			onClick={() => {
				if (!props.isEditable && props.id) {
					handleColorChange();
				}
			}}
			color={color}
			value={props.value}
		/>
	);
};

export const DateComp = props => {
	const date = new Date(props.value);
	const dispatch = useDispatch();
	const updateAnimationsAction = useCallback(
		(id, data) => dispatch(updateAnimations(id, data)),
		[dispatch]
	);

	const [color, setcolor] = useState(props.initialValue);

	const handleColorChange = () => {
		const colorValue = props.initialValue === '' ? 'red' : '';
		setcolor(colorValue);
		updateAnimationsAction(props.id, { color_date: colorValue });
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (props.initialValue !== color) setcolor(props.initialValue);
		});
		return () => clearTimeout(timeout);
	}, [props.initialValue]);

	return (
		<Etiquette
			type={props.value ? 'planning' : ''}
			isEditable={props.isEditable || (!props.isEditable && props.id)}
			onDoubleClick={props.onDoubleClick}
			onClick={() => {
				if (!props.isEditable && props.id) {
					handleColorChange();
				}
			}}
			color={props.value ? color : 'yellow'}
			value={props.value ? date.toLocaleDateString() : 'A définir'}
		/>
	);
};

export const HoraireComp = props => {
	const dispatch = useDispatch();
	const updateAnimationsAction = useCallback(
		(id, data) => dispatch(updateAnimations(id, data)),
		[dispatch]
	);

	const [color, setcolor] = useState(props.initialValue);

	const handleColorChange = () => {
		const colorValue = props.initialValue === '' ? 'red' : '';
		setcolor(colorValue);
		updateAnimationsAction(props.id, { color_horaire: colorValue });
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (props.initialValue !== color) setcolor(props.initialValue);
		});
		return () => clearTimeout(timeout);
	}, [props.initialValue]);

	return (
		<Etiquette
			type={props.value ? 'chrono' : ''}
			isEditable={props.isEditable || (!props.isEditable && props.id)}
			onDoubleClick={props.onDoubleClick}
			onClick={() => {
				if (!props.isEditable && props.id) {
					handleColorChange();
				}
			}}
			color={props.value ? color : 'yellow'}
			value={props.value ? props.value : 'A définir'}
		/>
	);
};

export const SimpleCompEtiquetteWY = props =>
	props.value || props.children ? (
		props.noEtiquette ? (
			<SpanStyle isEditable={props.isEditable} white={props.white} onDoubleClick={props.onDoubleClick}>
				{props.value || props.children}
			</SpanStyle>
		) : (
			<Etiquette
				isEditable={props.isEditable}
				value={props.value || props.children}
				onDoubleClick={props.onDoubleClick}
			/>
		)
	) : (
		<SpanStyle isEditable={props.isEditable} white={props.white} onDoubleClick={props.onDoubleClick}>
			-
		</SpanStyle>
	);

export const SimpleComp = props =>
	props.value || props.children ? (
		<SpanStyle isEditable={props.isEditable} white={props.white}>
			{props.value || props.children}
		</SpanStyle>
	) : (
		<Etiquette isEditable={props.isEditable} color='yellow' value='A définir' />
	);

export const SimpleCompEtiquette = props =>
	props.value || props.children ? (
		<Etiquette
			isEditable={props.isEditable}
			value={props.value || props.children}
			onDoubleClick={props.onDoubleClick}
		/>
	) : (
		<Etiquette
			isEditable={props.isEditable}
			color='yellow'
			value='A définir'
			onDoubleClick={props.onDoubleClick}
		/>
	);

export const LieuComp = props => (
	<Etiquette
		isEditable={props.isEditable}
		type={props.value ? 'lieux' : ''}
		color={props.value ? '' : 'yellow'}
		value={props.value ? props.value : 'A définir'}
		onDoubleClick={props.onDoubleClick}
	/>
);
