import axios from "axios";
import { navigate } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { gsap } from "gsap";
import React, { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import { setToken } from "../services/auth";

import Input from "../components/Input";
import InternetChecker from "../components/InternetChecker";
import Spinner from "../components/Spinner";
import PageLayout from "../layouts/Page";

const headerImg = "../images/header_login.png";
const logo = "../images/icons/logo.png";

const seoParams = {
  title: "Connexion",
  description: "Ecran de connexion à l'application planning",
};

const LoginContainer = styled.div`
  overflow: hidden;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;

  section {
    flex: 1;

    &:first-child {
      min-width: 45vw;

      .gatsby-image-wrapper {
        width: 100%;
      }

      img,
      picture {
        border-radius: 0 50px 0 0;
        height: 100vh;
        width: 45vw;
        min-width: 100%;
        object-fit: cover;
      }

      .shadow {
        position: absolute !important;
        left: 0;
        top: 0;
        opacity: 0.45;
        z-index: -1;
        filter: blur(130px);
      }
    }

    &:last-child {
      display: flex;
      flex-direction: column;
      justify-content: center;

      padding: 80px;

      h1 {
        margin-top: 15px;
        margin-bottom: 120px;
        color: ${({ theme }) => theme.purple};
      }

      .h1 {
        color: ${({ theme }) => theme.purple};
        margin-bottom: 40px;
      }
    }
  }

  .error {
    margin-top: 20px;
    color: ${({ theme }) => theme.red};
  }

  @media (min-width: 2430px) {
    section {
      &:first-child {
        min-width: 30vw;

        img,
        picture {
          width: 30vw;
        }
      }
    }
  }

  @media (max-width: 970px) {
    flex-direction: column;

    section {
      &:first-child {
        img,
        picture {
          border-radius: 0 0 50px 50px;
          height: 300px;
          width: 100vw;
        }

        .shadow {
          position: absolute !important;
          left: 0;
          top: 0;
          opacity: 0.45;
          z-index: -1;
          filter: blur(130px);
        }
      }
    }
  }
`;

const LoginPage = () => {
  const [serverState, setServerState] = useState({ submitting: false });
  const [message, setmessage] = useState(null);
  const animationHeader = useRef();
  const animationParent = useRef();

  // ANIMATIONS
  useLayoutEffect(() => {
    let ctx1 = gsap.context(() => {
      gsap.from("*:not(button)", {
        duration: 0.8,
        ease: "power3.inOut",
        y: 20,
        opacity: 0,
        stagger: 0.1,
      });

      gsap.from("button", {
        duration: 0.8,
        ease: "power3.inOut",
        opacity: 0,
        stagger: 0.1,
      });
    }, animationParent);

    let ctx2 = gsap.context(() => {
      gsap.from(animationHeader.current, {
        duration: 2,
        ease: "power3.inOut",
        x: -100,
      });
    }, animationHeader);

    return () => {
      ctx1.revert();
      ctx2.revert();
    };
  }, []);

  // HANDLE SUBMIT FORM
  const handleSubmit = (e) => {
    e.preventDefault();
    setServerState({ submitting: true });
    const form = e.target;
    const data = new FormData(form);

    axios({
      method: "post",
      url: "http://127.0.0.1:3000/auth/login",
      data: data,
    })
      .then((res) => {
        if (!!res.data.token) {
          setToken(res.data.token);
          setServerState({ submitting: false, status: "success" });
          console.log("okay");
          navigate("/");
        } else {
          setServerState({ submitting: false, status: "error" });
        }
      })
      .catch((error) => {
        setServerState({ submitting: false, status: "error" });
        if (error.response) {
          setmessage(error.response.data);
        } else setmessage(`Request failed : ${error.request}`);
      })
      .then(() => {
        setServerState({ submitting: false });
        setTimeout(() => {
          setmessage(null);
        }, 10000);
      });
  };

  return (
    <PageLayout seo={seoParams}>
      <LoginContainer>
        <section ref={animationHeader}>
          <StaticImage src={headerImg} alt="Image de la page de connexion" />
          <StaticImage
            className="shadow"
            src={headerImg}
            alt="Image de la page de connexion"
          />
        </section>
        <section ref={animationParent}>
          <StaticImage
            src={logo}
            alt="Logo Jour de Fete"
            layout="fixed"
            width={380}
          />
          <h1>Le planning</h1>

          <form onSubmit={handleSubmit}>
            <p className="h1 display">Connexion</p>
            <Input
              required
              autoComplete="username"
              // pattern='^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$'
              type="email"
              name="mail"
              label="E-mail"
              placeholder="personel@jourdefete.re"
              disabled={serverState.submitting}
              reset={serverState?.status}
            />
            <Input
              required
              autoComplete="current-password"
              type="password"
              name="password"
              label="Mot de passe"
              placeholder="●●●●●●●●"
              disabled={serverState.submitting}
              reset={serverState?.status}
            />
            <button
              className={`big purple ${
                serverState.submitting ? "disabled" : ""
              }`}
              type="submit"
            >
              {serverState.submitting && <Spinner />}
              {serverState.submitting ? "" : "Se connecter"}
            </button>
            {message && <p className="error">{message}</p>}
          </form>
        </section>
      </LoginContainer>
    </PageLayout>
  );
};

export default LoginPage;
