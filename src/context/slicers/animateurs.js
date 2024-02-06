import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../services/auth";

export const AnimateursSlicer = createSlice({
  name: "animateurs",
  initialState: {
    loading: false,
    hasErrors: false,
    data: [],
  },
  reducers: {
    callApi: (state) => {
      state.loading = true;
      state.hasErrors = false;
    },
    ApiCallBackData: (state, { payload }) => {
      state.data = payload;
      state.loading = false;
      state.hasErrors = false;
    },
    ApiCallBackNoData: (state) => {
      state.loading = false;
      state.hasErrors = false;
    },
    ApiCallBackFail: (state, { payload }) => {
      state.loading = false;
      state.hasErrors = {
        status: true,
        error: { payload },
      };
    },
  },
});

export const { callApi, ApiCallBackData, ApiCallBackNoData, ApiCallBackFail } =
  AnimateursSlicer.actions;
export default AnimateursSlicer.reducer;

/* ************************************************************************** */
/* *************************** THUNK ACTIONS ******************************** */
/* ************************************************************************** */

export const fetchAnimateurs = () => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    await token;
    if (!!token) {
      console.log("animateur token " + token);
      await axios
        .get(`http://localhost:3000/api/animateurs`)
        .then((res) => {
          console.log(res.data);
          res.data.statut === "success"
            ? dispatch(ApiCallBackData(res.data))
            : dispatch(
                ApiCallBackFail("La récupération des animateurss a échoué")
              );
        })
        .catch((error) => {
          dispatch(
            ApiCallBackFail(
              error === "AxiosError: Network Error"
                ? "Une erreur est survenue : la connexion au serveur a échoué"
                : "Une erreur est survenue : " + error
            )
          );
        });
    } else {
      dispatch(
        ApiCallBackFail(
          "Aucun jeton d'authentification, veuillez vous reconnecter"
        )
      );
    }
  };
};

export const addAnimateurs = (data) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .post(`http://localhost:3000/api/animateurs?token=${token}`, data)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(ApiCallBackFail("La création de l'animateur a échoué"));
        })
        .catch((error) => {
          dispatch(
            ApiCallBackFail(
              error === "AxiosError: Network Error"
                ? "Une erreur est survenue : la connexion au serveur a échoué"
                : "Une erreur est survenue : " + error
            )
          );
        });
    } else {
      dispatch(
        ApiCallBackFail(
          "Aucun jeton d'authentification, veuillez vous reconnecter"
        )
      );
    }
  };
};

export const deleteAnimateurs = (id, resend = true) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .delete(
          `http://localhost:3000/api/animateurs/${id}?token=${token}&resend=${resend}`
        )
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(
                ApiCallBackFail("La suppression de l'animateur a échoué")
              );
        })
        .catch((error) => {
          dispatch(
            ApiCallBackFail(
              error === "AxiosError: Network Error"
                ? "Une erreur est survenue : la connexion au serveur a échoué"
                : "Une erreur est survenue : " + error
            )
          );
        });
    } else {
      dispatch(
        ApiCallBackFail(
          "Aucun jeton d'authentification, veuillez vous reconnecter"
        )
      );
    }
  };
};

export const updateAnimateurs = (id, data) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .put(`http://localhost:3000/api/animateurs/${id}?token=${token}`, data)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(
                ApiCallBackFail("La modification de l'animateur a échoué")
              );
        })
        .catch((error) => {
          dispatch(
            ApiCallBackFail(
              error === "AxiosError: Network Error"
                ? "Une erreur est survenue : la connexion au serveur a échoué"
                : "Une erreur est survenue : " + error
            )
          );
        });
    } else {
      dispatch(
        ApiCallBackFail(
          "Aucun jeton d'authentification, veuillez vous reconnecter"
        )
      );
    }
  };
};
