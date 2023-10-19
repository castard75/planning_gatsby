import React, { memo, useState } from 'react';
import styled from 'styled-components';

const StyledInput = styled.label`
	display: block;
	font-family: 'Roboto', sans-serif;
	font-size: ${({ theme }) => theme.texteMedium};
	font-weight: ${({ theme }) => theme.lightWeight};

	input,
	textarea,
	select {
		display: block;
		background-color: ${props => (props.disabled ? props.theme.white : props.theme.grey)};
		pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
		color: ${props => props.theme.black};
		font-family: 'Lato', sans-serif;
		font-size: ${({ theme }) => theme.texteNormal};
		border: none;
		border-radius: 5px;
		padding: 6px 10px;
		width: min-content;
		outline: none !important;
		margin: ${props => (props.isDetailBoard ? '0px' : '15px 0px')};
		margin-bottom: ${props => (props.isDetailBoard ? '0px' : '30px')};
		transition: background 0.5s ease-in-out;
	}

	textarea {
		resize: none;
	}
`;

export const Select = memo(props => {
	return (
		<StyledInput disabled={props.disabled} isDetailBoard={props.isDetailBoard}>
			{props.label}
			<select
				autoFocus
				onChange={props.onChange}
				onBlur={props.onChange}
				name={props.name}
				id={props.name}
				disabled={props.disabled}
				required={props.required}
				value={props.value}
				defaultValue={props.defaultValue}>
				<option value='' disabled>
					Sélectionner une valeur
				</option>
				{props.options.map(option => (
					<option key={option.value} value={option.value}>
						{option.label}
					</option>
				))}
			</select>
		</StyledInput>
	);
});

const Input = props => {
	const [value, setValue] = useState(props.initialValue || '');
	if (props.reset && value !== null && value !== undefined && value !== '') setValue('');

	const handleChange = e => {
		if (props.directHandle !== true && e.key === 'Enter') {
			props.onChange(e);
		}
	};

	const renderInput =
		props.type === 'textarea' ? (
			<textarea
				autoFocus
				disabled={props.disabled}
				id={props.name}
				name={props.name}
				required={props.required}
				rows={props.row || 7}
				cols={props.cols || 30}
				value={value}
				placeholder={props.placeholder}
				onChange={e => {
					if (props.directHandle && props.onChange) props.onChange(e);
					setValue(e.target.value);
				}}
				onBlur={e => {
					props.onChange && props.onChange(e);
					setValue(e.target.value);
				}}
				onKeyDown={props.onChange && handleChange}></textarea>
		) : props.type === 'submit' ? (
			<input
				className={props.className}
				disabled={props.disabled}
				type={props.type}
				value={props.value}
				style={{ padding: '7px 21px' }}
			/>
		) : (
			<input
				autoFocus
				autoComplete={props.autoComplete}
				disabled={props.disabled}
				type={props.type}
				id={props.name}
				name={props.name}
				required={props.required}
				pattern={props.pattern}
				value={value}
				placeholder={props.placeholder}
				onChange={e => {
					if (props.directHandle && props.onChange) props.onChange(e);
					setValue(e.target.value);
				}}
				onBlur={e => {
					props.onChange && props.onChange(e);
					setValue(e.target.value);
				}}
				onKeyDown={props.onChange && handleChange}
			/>
		);

	return (
		<StyledInput disabled={props.disabled} isDetailBoard={props.isDetailBoard}>
			{props.label}
			{renderInput}
		</StyledInput>
	);
};

export default Input;
