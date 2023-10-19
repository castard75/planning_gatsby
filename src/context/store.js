import { configureStore } from '@reduxjs/toolkit';
import animateursReducer from './slicers/animateurs';
import animationsReducer from './slicers/animations';
import clientsReducer from './slicers/clients';
import dateReducer from './slicers/date';
import lieuxReducer from './slicers/lieux';

export default configureStore({
	reducer: {
		animateurs: animateursReducer,
		animations: animationsReducer,
		clients: clientsReducer,
		lieux: lieuxReducer,
		date: dateReducer,
	},
	middleware: getDefaultMiddleware =>
		getDefaultMiddleware({
			immutableCheck: false,
			serializableCheck: false,
		}),
});
