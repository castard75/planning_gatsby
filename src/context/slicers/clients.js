import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { getToken } from "../../services/auth";

export const ClientsSlicer = createSlice({
  name: "clients",
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
  ClientsSlicer.actions;
export default ClientsSlicer.reducer;

/* ************************************************************************** */
/* *************************** THUNK ACTIONS ******************************** */
/* ************************************************************************** */

export const fetchClients = () => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    await token;
    if (!!token) {
      await axios
        .get(`http://localhost:3000/api/clients`)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackData(res.data))
            : dispatch(ApiCallBackFail("La récupération des clients a échoué"));
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

export const addClients = (data) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .post(`http://localhost:3000/api/addClients?token=${token}`, data)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(ApiCallBackFail("La création du client a échoué"));
        })
        .then(() => window.location.reload())
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

export const deleteClients = (id, resend = true) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .delete(
          `http://localhost:3000/api/clients/${id}?token=${token}&resend=${resend}`
        )
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(ApiCallBackFail("La suppression du client a échoué"));
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

export const updateClients = (id, data) => {
  return async (dispatch) => {
    dispatch(callApi());

    const token = getToken().token;
    if (!!token) {
      await axios
        .put(`http://localhost:3000/api/clients/${id}?token=${token}`, data)
        .then((res) => {
          res.data.statut === "success"
            ? dispatch(ApiCallBackNoData())
            : dispatch(ApiCallBackFail("La modification du client a échoué"));
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
