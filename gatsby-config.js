module.exports = {
  siteMetadata: {
    title: `Jour de Fête - Le planning`,
    description: `Application de gestion du planning de Jour de Fête`,
    author: `Lionel Bataille`,
    siteUrl: `https://planning.jourdefete.re/`,
    keywords: [
      "planning",
      "application",
      "gestion",
      "974",
      "île de la Réunion",
      "Réunion",
      "Lionel",
      "Bataille",
    ],
  },
  plugins: [
    "gatsby-plugin-react-helmet",
    "gatsby-plugin-styled-components",
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `blurred`,
          quality: 50,
          breakpoints: [750, 1080, 1366, 1920],
          backgroundColor: `transparent`,
          tracedSVGOptions: {},
          blurredOptions: {},
          jpgOptions: {},
          pngOptions: {},
          webpOptions: {},
          avifOptions: {},
        },
      },
    },
    "gatsby-transformer-sharp",
    "gatsby-plugin-image",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-plugin-zopfli",
      options: {
        extensions: ["css", "html", "js", "svg"],
      },
    },
    "gatsby-plugin-sitemap",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: "Jour de Fête - Le planning",
        short_name: "Jour de Fête - Le planning",
        start_url: "/",
        background_color: "#942984",
        theme_color: "#942984",
        display: "standalone",
        lang: "fr",
        icon: "src/images/icons/fav_icon.png",
      },
    },
    "gatsby-plugin-offline",
    {
      resolve: `gatsby-plugin-layout`,
      options: {
        component: require.resolve(`./src/layouts/AppProvider.jsx`),
      },
    },
  ],
};
