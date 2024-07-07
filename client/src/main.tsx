import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/lib/theme-provider";
import { SocketProvider } from "./lib/socket-provider.tsx";
import { Analytics } from "@vercel/analytics/react";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID!}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
      useRefreshTokens
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <SocketProvider>
            <App />
          </SocketProvider>
        </ThemeProvider>
      </QueryClientProvider>
      <Toaster />
    </Auth0Provider>
    <Analytics />
  </>
);
