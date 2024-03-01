import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { ThemeProvider } from "@/components/providers/theme-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Auth0Provider
      domain={import.meta.env.VITE_DOMAIN}
      clientId={import.meta.env.VITE_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </Auth0Provider>
  </>
);
