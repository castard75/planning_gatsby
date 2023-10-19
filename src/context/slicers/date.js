import { createSlice } from '@reduxjs/toolkit';
const convertMonth = month => new Intl.DateTimeFormat('fr-FR', { month: 'long' }).format(month);

export const dateSlicer = createSlice({
	name: 'date',
	initialState: { year: new Date().getFullYear(), month: convertMonth(new Date()) },
	reducers: {
		setDate: (state, { payload }) => {
			const date = new Date(payload);
			state.year = date.getFullYear();
			state.month = convertMonth(date);
		},
	},
});

export const { setDate } = dateSlicer.actions;
export default dateSlicer.reducer;
