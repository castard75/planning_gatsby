import React, { memo } from 'react';
import { ThemeProvider, createGlobalStyle } from 'styled-components';

import '@fontsource/lato';
import '@fontsource/roboto';

const theme = {
	white: '#FFFFFF',
	grey: '#F7F7F7',
	black: '#001514',
	blue: '#002642',
	purple: '#942984',
	darkPurple: '#701F64',

	red: '#D81159',
	blueLight: '#3185FC',
	green: '#0EAD69',
	yellow: '#FFB81C',

	texteSmall: '0.75rem',
	texteNormal: '14px',
	texteMedium: '1.333rem',
	texteLarge: '1.777rem',
	texteDisplay: '2.369rem',
	texteDisplayXL: '3.157rem',

	extraLightWeight: '400',
	lightWeight: '500',
	normalWeight: '600',
	mediumWeight: '700',
	boldWeight: '900',
};

const GlobalStyle = createGlobalStyle`
    /* ###################################################### */
    /* ######################## BASE ######################## */
    /* ###################################################### */

    body {
        text-rendering: geometricPrecision;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* font-synthesis: style; */

        background-color: ${theme.white};

        font-family: "Roboto", sans-serif;
        font-weight: ${theme.extraLightWeight};
        font-size: ${theme.texteNormal};
        color: ${theme.black};

        padding: 0;
        margin: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    .h1,
    .h2,
    .h3,
    .h4,
    .h5,
    .h6 {
        font-family: "Lato", sans-serif;
        font-weight: ${theme.mediumWeight};
	    line-height: 39.29px;
        letter-spacing: -0.6632px;
        margin: 0px;
    }

    h1,
    .h1 {
        font-size: ${theme.texteDisplay};
        font-weight: ${theme.boldWeight};
        margin-bottom: 20px;

        &.display {
            font-size: ${theme.texteDisplayXL};
            font-weight: ${theme.boldWeight};
            margin-bottom: 25px;
        }
    }

    h2,
    .h2 {
        font-size: ${theme.texteLarge};
        margin-bottom: 15px;
    }

    h3,
    .h3 {
        font-size: ${theme.texteMedium};
        margin-bottom: 10px;
    }

    h4,
    h5,
    h6,
    .h4,
    .h5,
    .h6 {
        font-size: ${theme.texteMedium};
        margin-bottom: 10px;
    }

    p {
        font-size: ${theme.texteNormal};
        margin: 0px;
        margin-bottom: 10px;

        &.small {
            font-size: ${theme.texteSmall};
        }
    }

    span.small {
        font-size: ${theme.texteSmall};
    }

    a {
        text-decoration: none;
        color: ${theme.white};
        transition: color 0.5s ease;

        &:hover {
            text-decoration: none;
            color: ${theme.orange};
        }
    }

    strong,
    b {
        color: ${theme.white};
        font-weight: ${theme.boldWeight};
    }

    dl,
    ol,
    ul {
    }

    li {
    }

    button,
    .button {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer !important;
        font-size: ${theme.texteNormal} !important;
        font-weight: ${theme.mediumWeight} !important;
        background-color: ${theme.blue};
        padding: 6px 10px;
        color: ${theme.white};
        border: none;
        border-radius: 5px;
        opacity: 1 !important;
        box-shadow: 0px 0px 20px rgba(0, 38, 66, 0.3);
        transition: transform .3s ease-out, opacity .3s ease-out !important;

        img {
            display: block;
            margin-right: 5px;
        }

        &.noText {
            img {
                margin-right: 0px;
            }
        }

        &.purple {
            box-shadow: 0px 0px 20px rgba(148, 41, 132, 0.3);
            background-color: ${theme.purple} !important;
            color: ${theme.white} !important;
        }

        &.green {
            box-shadow: 0px 0px 20px rgba(14, 173, 105, 0.3);
            background-color: ${theme.green} !important;
            color: ${theme.white} !important;
        }

        &.red {
            box-shadow: 0px 0px 20px rgba(216, 17, 89, 0.3);
            background-color: ${theme.red} !important;
            color: ${theme.white} !important;
        }

        &.yellow {
            box-shadow: 0px 0px 20px rgba(255, 184, 28, 0.3);
            background-color: ${theme.yellow} !important;
            color: ${theme.white} !important;
        }


        &.border {
            border: 2px solid ${theme.blue};
            color: ${theme.blue};
            box-shadow: none !important;
            background-color: transparent !important;

            &.purple {
                border: 2px solid ${theme.purple} !important;
                color: ${theme.purple} !important;
            }

            &.green {
                border: 2px solid ${theme.green} !important;
                color: ${theme.green} !important;
            }

            &.red {
                border: 2px solid ${theme.red} !important;
                color: ${theme.red} !important;
            }

            &.yellow {
                border: 2px solid ${theme.yellow} !important;
                color: ${theme.yellow} !important;
            }
        }

        &.big {
            padding: 12px 20px;
        }

        &.disabled {
            pointer-events: none !important;
            cursor: not-allowed !important;
            opacity: 0.4 !important;
        }

        &:hover {
            transform: scale(1.08) !important;
        }

        &:active {
            transform: scale(0.98) !important;
        }
    }

    /* ########################################################### */
    /* ######################## STRUCTURE ######################## */
    /* ########################################################### */

    /* ######################## HEADER ######################## */

    header {
    }

    /* ######################## MAIN ######################## */

    main {
    }

    /* ######################## FOOTER ######################## */

    footer {
    }

    /* ######################## FORM ######################## */

    form {
        /* input[type="checkbox"] {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }

        .checkmark {
            position: relative;
            margin-right: 15px;
            height: 15px;
            width: 15px;
            border: 1px solid #000;
        }

        input[type="checkbox"]:checked ~ .checkmark {
            background-color: $red;
            border: none;
        }

        .checkmark:after {
            content: "";
            position: absolute;
            display: none;
        }

        input[type="checkbox"]:checked ~ .checkmark:after {
            display: block;
        }

        .checkmark:after {
            left: 5px;
            top: 2px;
            width: 5px;
            height: 10px;
            border: solid white;
            border-width: 0 3px 3px 0;
            -webkit-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            transform: rotate(45deg);
        } */
    }

    /* ####################################################### */
    /* ######################## CLASS ######################## */
    /* ####################################################### */

    /* ################################################################# */
    /* ######################## CAS PARTICULIER ######################## */
    /* ################################################################# */

    .home {
    }

    /* ############################################################# */
    /* ######################## MOBILE ADAPT ####################### */
    /* ############################################################# */

    @media screen and (max-width: 992px) {
    }

    @media screen and (max-width: 767px) {
    }

    @media screen and (max-width: 425px) {
    }

    @media print {
        @page {
            size: A4 landscape;
            margin: 0mm;
        }

        body {
            padding: 10mm;
        }

        .dontShowWhenPrint {
            display: none !important;
        }
    }
`;

const Theme = memo(props => (
	<ThemeProvider theme={theme}>
		<GlobalStyle />
		{props.children}
	</ThemeProvider>
));

export default Theme;
