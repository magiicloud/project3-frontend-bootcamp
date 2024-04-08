import axios, { AxiosRequestConfig } from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { BACKEND_URL } from "./constants";

export const useAuthenticatedRequest = () => {
  const { getAccessTokenSilently } = useAuth0();

  const sendRequest = async (url: string, options: AxiosRequestConfig = {}) => {
    try {
      const accessToken = await getAccessTokenSilently();
      const response = await axios({
        ...options,
        url: `${BACKEND_URL}${url}`,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response;
    } catch (err) {
      throw err;
    }
  };

  return sendRequest;
};

// HOW TO WRITE THE SYNTAX FOR REQ
// const response = await sendRequest("/api/data", {
//   method: "GET",
//   // additional options...
// });
