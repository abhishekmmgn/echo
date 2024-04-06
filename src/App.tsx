import Auth from "@/components/views/auth";
import Home from "@/components/views/home";
import { useAuth0 } from "@auth0/auth0-react";
import { DefaultSkeleton } from "./components/looks/default-loading";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return (
      <div className="h-screen w-screen grid place-items-center">
        <DefaultSkeleton />
      </div>
    );
  }

  return <>{!isAuthenticated ? <Home /> : <Auth />}</>;
}

export default App;
