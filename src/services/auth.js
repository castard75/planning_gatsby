const isBrowser = () => typeof window !== "undefined";
export const getToken = () => {
  if (isBrowser()) {
    const token = window.localStorage.getItem("planning-jdf-token");
    if (token) {
      return JSON.parse(token);
    }
  } else {
    console.log("pas de tokenData");
  }
  return {};
};
export const setToken = (token) => {
  if (isBrowser())
    window.localStorage.setItem(
      "planning-jdf-token",
      JSON.stringify({ token: token })
    );
  else return false;
};

export const haveTokenLogin = () => !!getToken().token;
export const logout = (callback) => {
  if (isBrowser()) window.localStorage.removeItem("planning-jdf-token");
  callback();
};
