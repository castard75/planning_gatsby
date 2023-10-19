import { useLocation } from '@reach/router';
import React, { forwardRef, memo } from 'react';
import styled from 'styled-components';
import Seo from '../components/SEO';

const StyledMain = styled.main`
	overflow: ${props => (props.isLoginPage ? 'auto' : 'hidden')};
	height: ${props => (props.isLoginPage ? '100vh' : 'calc(100vh - 30px)')};
	padding: ${props => (props.isLoginPage ? 0 : '15px 20px')};
	padding-bottom: ${props => (props.isLoginPage ? 0 : '15px')};

	header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15px;

		h1 {
			margin: 0;
		}
	}

	@media print {
		overflow: visible !important;
		height: auto !important;
		padding: 0;
	}
`;

const PageLayout = memo(
	forwardRef((props, ref) => {
		const location = useLocation();
		const isLoginPage = location.pathname === '/login' || location.pathname === '/login/';
		const { title, description, meta, image } = props.seo;

		return (
			<>
				<Seo title={title} description={description} meta={meta} image={image} />

				<StyledMain ref={ref} isLoginPage={isLoginPage}>
					{props.children}
				</StyledMain>
			</>
		);
	})
);

export default PageLayout;
