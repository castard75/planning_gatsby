import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../services/auth";

export const AnimationsSlicer = createSlice({
  name: "animations",
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
  AnimationsSlicer.actions;
export default AnimationsSlicer.reducer;

/* ************************************************************************** */
/* *************************** THUNK ACTIONS ******************************** */
/* ************************************************************************** */

export const fetchAnimations = (selectDate) => {
  return async (dispatch) => {
    dispatch(callApi());

    const convertedDate =
      selectDate.month === "janvier"
        ? "01"
        : selectDate.month === "février"
        ? "02"
        : selectDate.month === "mars"
        ? "03"
        : selectDate.month === "avril"
        ? "04"
        : selectDate.month === "mai"
        ? "05"
        : selectDate.month === "juin"
        ? "06"
        : selectDate.month === "juillet"
        ? "07"
        : selectDate.month === "août"
        ? "08"
        : selectDate.month === "septembre"
        ? "09"
        : selectDate.month === "octobre"
        ? "10"
        : selectDate.month === "novembre"
        ? "11"
        : selectDate.month === "décembre"
        ? "12"
        : "01";
    console.log(getToken().token);
    const token = getToken().token;
    await token;

    if (!!token) {
      await axios
        .get(`http://127.0.0.1:3000/api/animations`)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackData(res.data))
            : dispatch(
                ApiCallBackFail("La récupération des animations a échoué")
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
      dispatch(ApiCallBackFail("BUG ANIMATION"));
    }
  };
};

export const addAnimations = (data, number = 1) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .post(
          `http://127.0.0.1:3000/api/animations?token=${token}&number=${number}`,
          data
        )
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(ApiCallBackFail("La création de l'animation a échoué"));
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

export const deleteAnimations = (id, resend = true) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .delete(
          `http://127.0.0.1:3000/api/animations/${id}?token=${token}&resend=${resend}`
        )
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(
                ApiCallBackFail("La suppression de l'animation a échoué")
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

export const updateAnimations = (id, data) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .put(`http://127.0.0.1:3000/api/animations/${id}?token=${token}`, data)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(
                ApiCallBackFail("La modification de l'animation a échoué")
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
