import { Link } from 'gatsby';
import { gsap } from 'gsap';
import React, { memo, useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import { useNetwork } from './InternetChecker';

import animateursIcon from '../images/icons/animateursIcon.svg';
import clientsIcon from '../images/icons/clientsIcon.svg';
import disconnect from '../images/icons/disconnect.svg';
import lieuxIcon from '../images/icons/lieuxIcon.svg';
import logo from '../images/icons/logo.svg';
import planningIcon from '../images/icons/planningIcon.svg';

const StyledNavigation = styled.nav`
	transform: translateX(-100%);
	width: min-content;
	height: calc(100vh - 100px);
	min-height: 450px;
	padding: 0px;
	border-radius: 0 30px 30px 0;
	background-color: ${({ theme }) => theme.darkPurple};
	box-shadow: 0px 0px 120px rgba(112, 31, 100, 0.3);

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		margin-top: 65px;

		li {
			display: block;
			margin: 40px 0;
		}
	}

	a {
		opacity: 0.5;
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		color: ${({ theme }) => theme.white};
		font-family: 'Lato', sans-serif;
		font-weight: ${({ theme }) => theme.lightWeight};
		font-size: ${({ theme }) => theme.texteMedium};
		text-shadow: 0px 0px 30px rgba(255, 255, 255, 0);
		transition: opacity 0.3s ease, text-shadow 0.3s ease;

		span {
			margin-left: 10px;
		}

		img,
		picture {
			object-fit: contain;
			opacity: 0.5;
			text-shadow: 0px 0px 30px rgba(255, 255, 255, 0);
			transition: opacity 0.3s ease, text-shadow 0.3s ease;
			transform: scale(0.9);
		}

		&.active,
		&:hover {
			opacity: 1;
			text-shadow: 0px 0px 30px rgba(255, 255, 255, 0.3);

			img,
			picture {
				opacity: 1;
				text-shadow: 0px 0px 30px rgba(255, 255, 255, 0.3);
			}
		}
	}

	> a {
		position: absolute;
		bottom: 50px;
		font-size: ${({ theme }) => theme.texteNormal};

		img,
		picture {
			transform: scale(0.7);
		}
	}

	@media print {
		display: none !important;
	}
`;

const StyledStatut = styled.div`
	position: absolute;
	bottom: 20px;

	p {
		margin: 0;
		padding-left: 30px;
		color: ${({ theme }) => theme.white};
		font-size: ${({ theme }) => theme.texteNormal};
	}

	&:after {
		content: '';
		position: absolute;
		left: 3px;
		top: 1px;
		width: 14px;
		height: 14px;
		border-radius: 20px;
		background-color: ${props =>
			props.online && props.rtt <= 700
				? props.theme.green
				: props.online
				? props.theme.yellow
				: props.theme.red};
	}
`;

const InternetStatut = memo(() => {
	const networkState = useNetwork();
	return (
		<StyledStatut online={networkState.online} rtt={networkState.rtt}>
			<p>
				{networkState.online && networkState.rtt <= 700
					? 'En ligne'
					: networkState.online
					? 'Connexion instable'
					: 'Hors ligne'}
			</p>
		</StyledStatut>
	);
});

const Navigation = memo(props => {
	const animation = useRef();
	const isLogged = !(props.pathname === '/login' || props.pathname === '/login/');

	// ANIMATIONS
	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			gsap.to(animation.current, {
				x: isLogged ? '0%' : '-100%',
				padding: isLogged ? '50px 20px' : '50px 0px',
				duration: 0.8,
				ease: 'Expo.easeInOut',
			});
		}, animation);

		return () => ctx.revert();
	}, [isLogged]);

	return (
		<StyledNavigation ref={animation}>
			{isLogged && (
				<>
					<img src={logo} alt='Logo Jour de Fete' width={150} />
					<ul>
						<li>
							<Link onClick={props.handleMenu} activeClassName={'active'} to='/'>
								<img src={planningIcon} alt='Planning icon' width={26} height={26} />
								<span>Planning</span>
							</Link>
						</li>

						<li>
							<Link onClick={props.handleMenu} activeClassName={'active'} to='/animateurs'>
								<img src={animateursIcon} alt='Animateurs icon' width={26} height={26} />
								<span>Animateurs</span>
							</Link>
						</li>

						<li>
							<Link onClick={props.handleMenu} activeClassName={'active'} to='/clients'>
								<img src={clientsIcon} alt='Clients icon' width={26} height={26} />
								<span>Clients</span>
							</Link>
						</li>

						<li>
							<Link onClick={props.handleMenu} activeClassName={'active'} to='/lieux'>
								<img src={lieuxIcon} alt='Lieux icon' width={26} height={26} />
								<span>Lieux</span>
							</Link>
						</li>
					</ul>
					<a
						href='#disconnect'
						onClick={e => {
							e.preventDefault();
							props.handleDisconnect();
						}}>
						<img src={disconnect} alt='Déconnexion icon' width={21} height={21} />
						<span>Déconnexion</span>
					</a>
					<InternetStatut />
				</>
			)}
		</StyledNavigation>
	);
});

export default Navigation;
