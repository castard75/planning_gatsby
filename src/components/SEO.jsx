import { useLocation } from '@reach/router';
import { graphql, useStaticQuery } from 'gatsby';
import React, { memo } from 'react';
import { Helmet } from 'react-helmet';

import defaultImage from '../images/defaultImage.jpg';

const SEO = memo(({ description, lang, meta, image: metaImage, title }) => {
	const { pathname } = useLocation();
	const { site } = useStaticQuery(
		graphql`
			query {
				site {
					siteMetadata {
						title
						description
						author
						keywords
						siteUrl
					}
				}
			}
		`
	);

	const metaDescription = description || site.siteMetadata.description;
	const image = metaImage && metaImage.src ? `${site.siteMetadata.siteUrl}${metaImage.src}` : null;
	const canonical = pathname ? `${site.siteMetadata.siteUrl}${pathname}` : null;

	return (
		<Helmet
			defer={false}
			htmlAttributes={{
				lang,
			}}
			title={title}
			titleTemplate={`%s | ${site.siteMetadata.title}`}
			link={
				canonical
					? [
							{
								rel: 'canonical',
								href: canonical,
							},
					  ]
					: []
			}
			meta={[
				{
					name: `description`,
					content: metaDescription,
				},
				{
					name: 'keywords',
					content: site.siteMetadata.keywords.join(','),
				},
				{
					property: `og:title`,
					content: title,
				},
				{
					property: `og:description`,
					content: metaDescription,
				},
				{
					property: `og:type`,
					content: `website`,
				},
				{
					name: `twitter:creator`,
					content: site.siteMetadata.author,
				},
				{
					name: `twitter:title`,
					content: title,
				},
				{
					name: `twitter:description`,
					content: metaDescription,
				},
			]
				.concat(
					metaImage
						? [
								{
									property: 'og:image',
									content: image,
								},
								{
									property: 'og:image:width',
									content: metaImage.width,
								},
								{
									property: 'og:image:height',
									content: metaImage.height,
								},
								{
									name: 'twitter:card',
									content: 'summary_large_image',
								},
						  ]
						: [
								{
									name: 'twitter:card',
									content: 'summary',
								},
						  ]
				)
				.concat(meta)}>
			<script type='application/ld+json'>
				{`
                    {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        "url": "https://www.planning.jourdefete.re/",
                        "logo": "https://www.planning.jourdefete.re/icons/icon-512x512.png",
                        "name": "planning.jourdefete.re"
                    }
                `}
			</script>
		</Helmet>
	);
});

SEO.defaultProps = {
	lang: `fr`,
	image: {
		src: defaultImage,
		width: 1081,
		height: 609,
	},
	meta: [],
};

export default SEO;
