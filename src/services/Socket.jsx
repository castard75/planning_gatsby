import { navigate } from 'gatsby';
import React, { useCallback, useEffect, useRef } from 'react';
import socketIO from 'socket.io-client';
import styled from 'styled-components';
import { useNetwork } from '../components/InternetChecker';
import { getToken, haveTokenLogin, logout } from '../services/auth';

import { useDispatch, useSelector } from 'react-redux';
import { fetchAnimateurs } from '../context/slicers/animateurs';
import { fetchAnimations } from '../context/slicers/animations';
import { fetchClients } from '../context/slicers/clients';
import { fetchLieux } from '../context/slicers/lieux';

import PopupMessage from '../components/PopupMessage';
import Spinner from '../components/Spinner';
const SOCKET_URL = '/';
var isInitSockets = false;

const Loader = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	background: ${props => props.theme.white};
	z-index: 9999;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

const Socket = props => {
	const selectDate = useSelector(state => state.date);
	const networkState = useNetwork();
	var socketProvider = useRef(false);
	const [socketStat, setsocketStat] = React.useState({
		socket: false,
		auth: false,
		waitAuth: true,
		messageServeur: '',
		currentSocket: false,
	});

	const updateSocketStat = newStat => setsocketStat(socketStat => ({ ...socketStat, ...newStat }));

	const dispatch = useDispatch();
	const fetchAnimationsAction = useCallback(
		() => dispatch(fetchAnimations(selectDate)),
		[dispatch, selectDate]
	);
	const fetchAnimateursAction = useCallback(() => dispatch(fetchAnimateurs()), [dispatch]);
	const fetchClientsAction = useCallback(() => dispatch(fetchClients()), [dispatch]);
	const fetchLieuxAction = useCallback(() => dispatch(fetchLieux()), [dispatch]);

	const disconnectSocket = useCallback(() => {
		setTimeout(
			() =>
				logout(() => {
					if (socketProvider.current) socketProvider.current.disconnect();
					updateSocketStat({
						socket: false,
						auth: false,
						waitAuth: true,
						messageServeur: '',
						currentSocket: false,
					});
					navigate('/login');
				}),
			3000
		);
	}, [socketProvider]);

	const initSocket = useCallback(
		async (callback = false) => {
			isInitSockets = true;

			try {
				const token = getToken().token;
				if (!!token) {
					socketProvider.current = await socketIO.connect(SOCKET_URL);

					updateSocketStat({ messageServeur: 'Connexion au serveur ...' });
					updateSocketStat({ socket: socketProvider.current ? true : false });

					socketProvider.current.on('connect', () => {
						console.log('Successfully connected to socket.');
						console.log('Wait for socket authenticate.');
						updateSocketStat({
							messageServeur: "Connecté au serveur, en attente d'authentification.",
						});

						var timeoutSocket = setTimeout(() => {
							console.log('Socket timeout, disconnecting.');
							updateSocketStat({
								messageServeur: "Temps d'attente dépassé, déconnexion du serveur.",
							});
							if (callback) callback(socketProvider.current, false);
							disconnectSocket();
						}, 3500);

						socketProvider.current.emit('authenticate', { token: token });
						socketProvider.current.on('authenticated', () => {
							console.log('Authenticated with socket.');
							updateSocketStat({
								messageServeur: 'Authentification réussie !',
								waitAuth: false,
								auth: true,
							});

							socketProvider.current.on('disconnect', reason => {
								if (reason === 'transport close' || reason === 'io server disconnect') {
									console.log('Application disconnected : ' + reason);
									updateSocketStat({
										messageServeur: 'Erreur serveur, déconnexion.',
									});
									disconnectSocket();
								}
							});

							clearTimeout(timeoutSocket);
							if (callback) callback(socketProvider.current, true);
						});
					});
				} else {
					console.log('No token available, redirecting to login.');
					updateSocketStat({ messageServeur: 'Pas de token, veuillez vous authentifier.' });
					disconnectSocket();
				}

				isInitSockets = false;
			} catch (err) {
				console.log(err);
				updateSocketStat({ messageServeur: 'Erreur lors de la connexion au serveur.' });
				disconnectSocket();

				isInitSockets = false;
			}
		},
		[socketProvider, disconnectSocket]
	);

	useEffect(() => {
		const timeout = setTimeout(() => {
			fetchAnimationsAction();
			socketStat.currentSocket && socketStat.currentSocket.removeAllListeners('subscribeAnimations');
			socketStat.currentSocket &&
				socketStat.currentSocket.on('subscribeAnimations', fetchAnimationsAction);
		});
		return () => clearTimeout(timeout);
	}, [fetchAnimationsAction, selectDate, socketStat.currentSocket]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			if (props.pathname === '/login' || props.pathname === '/login/') {
				if (haveTokenLogin() && socketStat.socket && socketStat.auth) navigate('/');
			} else {
				if (networkState.online && networkState.rtt <= 1300) {
					if (haveTokenLogin()) {
						if (!socketStat.socket || !socketStat.auth) {
							if (!isInitSockets) {
								console.log('No socket connection, init socket');
								initSocket((socket, stat) => {
									if (!stat) {
										navigate('/login');
									} else {
										updateSocketStat({ currentSocket: socket });

										fetchAnimationsAction();
										fetchAnimateursAction();
										fetchClientsAction();
										fetchLieuxAction();

										socket.removeAllListeners('subscribeAnimateurs');
										socket.removeAllListeners('subscribeLieux');
										socket.removeAllListeners('subscribeClients');

										socket.on('subscribeAnimateurs', fetchAnimateursAction);
										socket.on('subscribeClients', fetchClientsAction);
										socket.on('subscribeLieux', fetchLieuxAction);
									}
								});
							}
						}
					} else {
						console.log('No token available, redirecting to login.');
						updateSocketStat({ messageServeur: 'Pas de token, veuillez vous authentifier.' });
						disconnectSocket();
					}
				} else {
					if (networkState.online && networkState.rtt >= 1300) {
						console.log('Bad internet connection.');
						updateSocketStat({ messageServeur: 'Mauvaise connexion internet.' });
					} else {
						console.log('No internet connection !');
						updateSocketStat({ messageServeur: 'Aucune connexion internet.' });
					}
					disconnectSocket();
				}
			}
		});
		return () => clearTimeout(timeout);
	}, [
		props.pathname,
		socketStat.auth,
		socketStat.socket,
		networkState.online,
		networkState.rtt,
		initSocket,
		disconnectSocket,
		fetchAnimateursAction,
		fetchAnimationsAction,
		fetchClientsAction,
		fetchLieuxAction,
	]);

	return (
		<>
			<PopupMessage message={socketStat.messageServeur !== false ? socketStat.messageServeur : false} />
			{socketStat.waitAuth && !(props.pathname === '/login' || props.pathname === '/login/') && (
				<Loader>
					<Spinner color='purple' messageServeur={socketStat.messageServeur} />
				</Loader>
			)}
			{props.disconnect(disconnectSocket)}
		</>
	);
};

export default Socket;
