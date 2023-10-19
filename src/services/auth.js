const isBrowser = () => typeof window !== 'undefined';
export const getToken = () =>
	isBrowser() && window.localStorage.getItem('planning-jdf-token')
		? JSON.parse(window.localStorage.getItem('planning-jdf-token'))
		: {};

export const setToken = token => {
	if (isBrowser()) window.localStorage.setItem('planning-jdf-token', JSON.stringify({ token: token }));
	else return false;
};

export const haveTokenLogin = () => !!getToken().token;
export const logout = callback => {
	if (isBrowser()) window.localStorage.removeItem('planning-jdf-token');
	callback();
};
