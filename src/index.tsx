import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { Toaster } from "./components/ui/toaster";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH_CLIENT_ID!}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <App />
    <Toaster />
  </Auth0Provider>
);
