import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Auth0Provider } from "@auth0/auth0-react";
import { Toaster } from "./components/ui/toaster";
import { UserProvider } from "./components/UserContext";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Auth0Provider
    domain={process.env.REACT_APP_AUTH_DOMAIN!}
    clientId={process.env.REACT_APP_AUTH_CLIENT_ID!}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: process.env.REACT_APP_AUTH_API!,
      scope:
        "openid profile email read:current_user update:current_user_metadata",
    }}
    useRefreshTokens={true}
    cacheLocation="localstorage"
  >
    <UserProvider>
      <App />
      <Toaster />
    </UserProvider>
  </Auth0Provider>
);
