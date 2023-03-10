import axios from "axios";


export const configAxios = () => {
  axios.defaults.baseURL = process.env.API_URL;

  axios.interceptors.response.use(
    function (response) {
      if (response.data) {
        // return success
        if (response.status === 200 || response.status === 201) {
          return response;
        }
        // reject errors & warnings
        return Promise.reject(response);
      }

      // default fallback
      return Promise.reject(response);
    },
    function (error) {
      // if the server throws an error (404, 500 etc.)
      return Promise.reject(error);
    }
  );
};