import Auth from "@/components/views/auth";
import Home from "@/components/views/home";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isAuthenticated, isLoading } = useAuth0();
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return <>{!isAuthenticated ? <Home /> : <Auth />}</>;
}

export default App;
