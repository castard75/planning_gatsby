import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';

const KEY_BACKSPACE = 'Backspace';
const KEY_DELETE = 'Delete';
const KEY_ENTER = 'Enter';
const KEY_TAB = 'Tab';

export class DatePicker {
	// gets called once before the renderer is used
	init(params) {
		// create the cell
		this.eInput = document.createElement('input');
		this.eInput.value = params.value;
		this.eInput.classList.add('ag-text-field-input');
		this.eInput.classList.add('ag-input-field-input');
		this.eInput.style.height = '100%';
		this.eInput.type = 'date';
		this.date = params.value;
	}

	// gets called once when grid ready to insert the element
	getGui() {
		return this.eInput;
	}

	// focus and select can be done after the gui is attached
	afterGuiAttached() {
		this.eInput.focus();
		this.eInput.select();
	}

	// returns the new value after editing
	getValue() {
		return this.eInput.value === '' ? this.date : this.eInput.value;
	}

	// any cleanup we need to be done here
	destroy() {
		// but this example is simple, no cleanup, we could
		// even leave this method out as it's optional
	}

	// if true, then this editor will appear in a popup
	isPopup() {
		// and we could leave this method out also, false is the default
		return false;
	}
}

export class HoursPicker {
	// gets called once before the renderer is used
	init(params) {
		// create the cell
		this.eInput = document.createElement('input');
		this.eInput.value = params.value;
		this.eInput.classList.add('ag-text-field-input');
		this.eInput.classList.add('ag-input-field-input');
		this.eInput.style.height = '100%';
		this.eInput.type = 'time';
	}

	// gets called once when grid ready to insert the element
	getGui() {
		return this.eInput;
	}

	// focus and select can be done after the gui is attached
	afterGuiAttached() {
		this.eInput.focus();
		this.eInput.select();
	}

	// returns the new value after editing
	getValue() {
		return this.eInput.value;
	}

	// any cleanup we need to be done here
	destroy() {
		// but this example is simple, no cleanup, we could
		// even leave this method out as it's optional
	}

	// if true, then this editor will appear in a popup
	isPopup() {
		// and we could leave this method out also, false is the default
		return false;
	}
}

export const NumericPicker = forwardRef((props, ref) => {
	const createInitialState = () => {
		let startValue;

		if (props.key === KEY_BACKSPACE || props.key === KEY_DELETE) {
			// if backspace or delete pressed, we clear the cell
			startValue = '';
		} else if (props.charPress) {
			// if a letter was pressed, we start with the letter
			startValue = props.charPress;
		} else {
			// otherwise we start with the current value
			startValue = props.value;
		}

		return {
			value: startValue,
		};
	};

	const initialState = createInitialState();
	const [value, setValue] = useState(initialState.value);
	const refInput = useRef(null);

	// focus on the input
	useEffect(() => {
		// get ref from React component
		const timeout = window.setTimeout(() => {
			const eInput = refInput.current;
			eInput.focus();
		});
		return () => clearTimeout(timeout);
	}, []);

	/* Utility Methods */
	const cancelBeforeStart = props.charPress && '1234567890'.indexOf(props.charPress) < 0;

	const isLeftOrRight = event => {
		return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1;
	};

	const isCharNumeric = charStr => {
		return !!/\d/.test(charStr);
	};

	const isKeyPressedNumeric = event => {
		const charStr = event.key;
		return isCharNumeric(charStr);
	};

	const deleteOrBackspace = event => {
		return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.key) > -1;
	};

	const finishedEditingPressed = event => {
		const key = event.key;
		return key === KEY_ENTER || key === KEY_TAB;
	};

	const onKeyDown = event => {
		if (isLeftOrRight(event) || deleteOrBackspace(event)) {
			event.stopPropagation();
			return;
		}

		if (!finishedEditingPressed(event) && !isKeyPressedNumeric(event)) {
			if (event.preventDefault) event.preventDefault();
		}
	};

	/* Component Editor Lifecycle methods */
	useImperativeHandle(ref, () => {
		return {
			// the final value to send to the grid, on completion of editing
			getValue() {
				return value;
			},

			// Gets called once before editing starts, to give editor a chance to
			// cancel the editing before it even starts.
			isCancelBeforeStart() {
				return cancelBeforeStart;
			},
		};
	});

	return (
		<input
			className='ag-text-field-input ag-input-field-input'
			style={{ height: '100%' }}
			ref={refInput}
			value={value}
			onChange={event => setValue(event.target.value)}
			onKeyDown={event => onKeyDown(event)}
		/>
	);
});

export const NumericPicker5 = forwardRef((props, ref) => {
	const createInitialState = () => {
		let startValue;

		if (props.key === KEY_BACKSPACE || props.key === KEY_DELETE) {
			// if backspace or delete pressed, we clear the cell
			startValue = '';
		} else if (props.charPress) {
			// if a letter was pressed, we start with the letter
			startValue = props.charPress;
		} else {
			// otherwise we start with the current value
			startValue = props.value;
		}

		return {
			value: startValue,
		};
	};

	const initialState = createInitialState();
	const [value, setValue] = useState(initialState.value);
	const refInput = useRef(null);

	// focus on the input
	useEffect(() => {
		// get ref from React component
		const timeout = window.setTimeout(() => {
			const eInput = refInput.current;
			eInput.focus();
		});
		return () => clearTimeout(timeout);
	}, []);

	/* Utility Methods */
	const cancelBeforeStart = props.charPress && '1234567890'.indexOf(props.charPress) < 0;

	const isLeftOrRight = event => {
		return ['ArrowLeft', 'ArrowRight'].indexOf(event.key) > -1;
	};

	const isCharNumeric = charStr => {
		return !!/\d/.test(charStr);
	};

	const isKeyPressedNumeric = event => {
		const charStr = event.key;
		return isCharNumeric(charStr);
	};

	const deleteOrBackspace = event => {
		return [KEY_DELETE, KEY_BACKSPACE].indexOf(event.key) > -1;
	};

	const finishedEditingPressed = event => {
		const key = event.key;
		return key === KEY_ENTER || key === KEY_TAB;
	};

	const onKeyDown = event => {
		if (isLeftOrRight(event) || deleteOrBackspace(event)) {
			event.stopPropagation();
			return;
		}

		if (!finishedEditingPressed(event) && !isKeyPressedNumeric(event)) {
			if (event.preventDefault) event.preventDefault();
		}
	};

	/* Component Editor Lifecycle methods */
	useImperativeHandle(ref, () => {
		return {
			// the final value to send to the grid, on completion of editing
			getValue() {
				return value;
			},

			// Gets called once before editing starts, to give editor a chance to
			// cancel the editing before it even starts.
			isCancelBeforeStart() {
				return cancelBeforeStart;
			},

			isCancelAfterEnd() {
				return value > 5;
			},
		};
	});

	return (
		<input
			className='ag-text-field-input ag-input-field-input'
			style={{ height: '100%' }}
			ref={refInput}
			value={value}
			onChange={event => setValue(event.target.value)}
			onKeyDown={event => onKeyDown(event)}
		/>
	);
});
