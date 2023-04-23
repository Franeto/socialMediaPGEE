import axios from "axios";

export const loginCall = async (userCredential, dispatch) => {
  dispatch({ type: "LOGIN_START" });
  try {
    const axiosLink = "https://pgee-social-media.herokuapp.com/api/auth/login";
    const res = await axios.post(axiosLink, userCredential);
    dispatch({ type: "LOGIN_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "LOGIN_FAILURE", payload: err });

  }
};
export const logoutCall = async (dispatch) => {
  dispatch({ type: "LOGOUT" });
};
