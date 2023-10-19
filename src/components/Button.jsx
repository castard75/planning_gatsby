import React, { useEffect, useState } from 'react';

import addIcon from '../images/icons/addIcon.svg';
import deleteIcon from '../images/icons/deleteIcon.svg';
import modifIcon from '../images/icons/modifIcon.svg';

import addIcon_border from '../images/icons/addIcon_border.svg';
import deleteIcon_border from '../images/icons/deleteIcon_border.svg';

const Button = props => {
	const [className, setClassName] = useState(props.className);

	/* IMG */
	let img = null;

	if (props.type === 'add') {
		if (props.className) {
			props.className.indexOf('border') !== -1
				? (img = <img src={addIcon_border} alt='Add icon' width={22} height={22} />)
				: (img = <img src={addIcon} alt='Add icon' width={22} height={22} />);
		} else {
			img = <img src={addIcon} alt='Add icon' width={22} height={22} />;
		}
	}

	if (props.type === 'delete') {
		if (props.className) {
			props.className.indexOf('border') !== -1
				? (img = <img src={deleteIcon_border} alt='Delete icon' width={22} height={22} />)
				: (img = <img src={deleteIcon} alt='Delete icon' width={22} height={22} />);
		} else {
			img = <img src={deleteIcon} alt='Delete icon' width={22} height={22} />;
		}
	}

	if (props.type === 'update') img = <img src={modifIcon} alt='Add icon' width={22} height={22} />;

	/* FUNCTION */
	const handleClick = () => {
		if (props.type === 'delete') setClassName(state => state + ' disabled');
		setTimeout(() => setClassName(state => state.replace('disabled', '')), 3000);
		props.onClick();
	};

	useEffect(() => {
		const timeout = setTimeout(() => {
			let classNameToAdd = props.className;

			if (props.type === 'delete')
				classNameToAdd += props.className
					? props.className.indexOf('red') !== -1
						? null
						: ' red'
					: 'red';
			if (!props.text) classNameToAdd += ' noText';

			setClassName(classNameToAdd);
		});
		return () => clearTimeout(timeout);
	}, [props.className, props.text, props.type]);

	return (
		<button onClick={handleClick} className={className}>
			{img}
			{props.text}
		</button>
	);
};

export default Button;
