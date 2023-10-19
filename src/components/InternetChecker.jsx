import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledInternetChecker = styled.h2`
	background-color: rgb(148 41 132 / 15%);
	color: ${({ theme }) => theme.darkPurple};
	font-size: ${({ theme }) => theme.texteMedium};
	padding: 20px 25px;
	border-radius: 15px;

	small {
		display: block;
		font-weight: ${({ theme }) => theme.lightWeight};
		font-size: ${({ theme }) => theme.texteNormal};
	}
`;

const inBrowser = typeof navigator !== 'undefined';

const getNetworkConnection = () =>
	inBrowser ? navigator.connection || navigator.mozConnection || navigator.webkitConnection || null : null;
const getNetworkOnline = () => (inBrowser && typeof navigator.onLine === 'boolean' ? navigator.onLine : true);

const getNetworkConnectionInfo = () => {
	const connection = getNetworkConnection();
	if (!connection) return {};

	return {
		rtt: connection.rtt,
		type: connection.type,
		saveData: connection.saveData,
		downLink: connection.downLink,
		downLinkMax: connection.downLinkMax,
		effectiveType: connection.effectiveType,
	};
};

export const useNetwork = () => {
	const [state, setState] = useState(() => {
		return {
			since: undefined,
			online: getNetworkOnline(),
			...getNetworkConnectionInfo(),
		};
	});

	useEffect(() => {
		const handleOnline = () => {
			setState(prevState => ({
				...prevState,
				online: true,
				since: new Date().toString(),
			}));
		};

		const handleOffline = () => {
			setState(prevState => ({
				...prevState,
				online: false,
				since: new Date().toString(),
			}));
		};

		const handleConnectionChange = () => {
			setState(prevState => ({
				...prevState,
				...getNetworkConnectionInfo(),
			}));
		};

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		const connection = getNetworkConnection();
		connection?.addEventListener('change', handleConnectionChange);

		return () => {
			window.removeEventListener('online', handleOnline);
			window.removeEventListener('offline', handleOffline);
			connection?.removeEventListener('change', handleConnectionChange);
		};
	}, []);
	return state;
};

const InternetChecker = props => {
	const networkState = useNetwork();
	const { online, rtt } = networkState;
	return online && rtt <= 1300 ? (
		props.children
	) : (
		<StyledInternetChecker>
			Désolé... nous n'avons pas pu nous connecter à Internet. <br />
			Veuillez vérifier votre connexion.
			<small>Le formulaire sera à nouveau disponible automatiquement</small>
		</StyledInternetChecker>
	);
};

export default InternetChecker;
