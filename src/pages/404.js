import { gsap } from 'gsap';
import React, { memo, useLayoutEffect, useRef } from 'react';
import PageLayout from '../layouts/Page';

const seoParams = {
	title: '404: Not found',
	description: 'Page not found',
};

const NotFoundPage = memo(() => {
	const animationParent = useRef();

	// ANIMATIONS
	useLayoutEffect(() => {
		let ctx = gsap.context(() => {
			gsap.from('h1, h2, p, a', {
				duration: 0.8,
				ease: 'power3.inOut',
				y: 20,
				opacity: 0,
				stagger: 0.1,
			});
		}, animationParent);

		return () => ctx.revert();
	}, []);

	return (
		<PageLayout seo={seoParams}>
			<h1>404: Not Found</h1>
			<p>Cette page n'existe pas !</p>
		</PageLayout>
	);
});

export default NotFoundPage;
