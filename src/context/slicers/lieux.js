import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../services/auth";

export const LieuxSlicer = createSlice({
  name: "lieux",
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
  LieuxSlicer.actions;
export default LieuxSlicer.reducer;

/* ************************************************************************** */
/* *************************** THUNK ACTIONS ******************************** */
/* ************************************************************************** */

export const fetchLieux = () => {
  return async (dispatch) => {
    dispatch(callApi());
    console.log("lieu pas token ");
    const token = getToken().token;
    if (!!token) {
      console.log("lieu token " + token);
      await axios
        .get(`/api/lieux?token=${token}`)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackData(res.data))
            : dispatch(ApiCallBackFail("La récupération des lieux a échoué"));
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

export const addLieux = (data) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .post(`/api/lieux?token=${token}`, data)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(ApiCallBackFail("La création du lieu a échoué"));
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

export const deleteLieux = (id, resend = true) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .delete(`/api/lieux/${id}?token=${token}&resend=${resend}`)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(ApiCallBackFail("La suppression du lieu a échoué"));
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

export const updateLieux = (id, data) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .put(`/api/lieux/${id}?token=${token}`, data)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(ApiCallBackFail("La modification du lieu a échoué"));
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
