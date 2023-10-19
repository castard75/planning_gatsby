import loadable from '@loadable/component';
import React, { Component, memo } from 'react';
import { Provider } from 'react-redux';
import appStore from '../context/store';
import Socket from '../services/socket';
import ThemeProvider from './Theme';
const Navigation = loadable(() => import('../components/Navigation'));

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	render() {
		const { children } = this.props;
		const { hasError } = this.state;
		if (!hasError) {
			return children;
		}
		const mailLink = `mailto:lionel.bataille@hotmail.com?subject=${encodeURIComponent(
			"Erreur sur l'Application Web"
		)}`;
		return (
			<div
				style={{
					width: '100vw',
					height: '100vh',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignContent: 'center',
					textAlign: 'center',
					color: '#701F64',
				}}>
				<h2>Erreur interne</h2>
				<p>Oups ! Quelque chose ne s'est pas passé comme prévu.</p>
				<p>
					Vous pouvez essayer de recharger la page. Si le problème persiste,
					<a style={{ color: '#942984' }} href={mailLink}>
						&nbsp;contactez-nous
					</a>
					.
				</p>
			</div>
		);
	}
}

const MemoizedTheme = memo(ThemeProvider);
const MemoizedErrorBoundary = memo(ErrorBoundary);

const Body = memo(props => {
	return (
		<MemoizedTheme>
			<MemoizedErrorBoundary>
				<Provider store={appStore}>
					<Socket
						pathname={props.location.pathname}
						disconnect={disconnectSocket => (
							<div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
								<Navigation
									pathname={props.location.pathname}
									handleDisconnect={disconnectSocket}
								/>
								<div style={{ flex: 1 }}>{props.children}</div>
							</div>
						)}
					/>
				</Provider>
			</MemoizedErrorBoundary>
		</MemoizedTheme>
	);
});

export default Body;
