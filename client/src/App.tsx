import Auth from "@/components/views/auth";
import Home from "@/components/views/home";
import { useAuth0 } from "@auth0/auth0-react";
import { DefaultSkeleton } from "./components/default-loading";
import { useCurrentUser } from "@/store";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import api from "@/api/axios";

function App() {
  const [error, setError] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth0();
  const { uid, changeCurrentUser } = useCurrentUser();

  async function createAccount() {
    const uid = uuidv4() + Date.now();
    console.log(uid);
    try {
      // await api.post("/current_user", {
      //   uid,
      //   name: user?.name,
      //   email: user?.email,
      //   picture: user?.picture,
      // });
      changeCurrentUser(uid, user?.name!, user?.picture!, user?.email!);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  }
  async function fetchCurrentUser() {
    const res = await api.get("current_user")
    console.log(res.data)
    try {
      const res = await api.get("/current_user");
      const data = res.data;
      console.log(data);
      if (!data.uid) {
        console.log("User not found");
        createAccount();
      } else if (data.uid) {
        // user exits, set local state
        console.log("User found");
        changeCurrentUser(data.uid, data.name, data.picture, user?.email!);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    }
  }
  // useEffect(() => {
  //   if (isAuthenticated && !uid) {
  //     fetchCurrentUser();
  //   }
  // }, [isAuthenticated]);

  if (error) {
    return (
      <div className="h-screen w-screen grid place-items-center">
        <p className="text-destructive">Something went wrong</p>
      </div>
    );
  }
  if (isLoading || (isAuthenticated && !uid)) {
    return (
      <div className="h-screen w-screen grid place-items-center">
        <DefaultSkeleton />
      </div>
    );
  }
  // return <Bu tton onClick={fetchCurrentUser}>click</Button>;
  return <>{!isAuthenticated ? <Home /> : <Auth />}</>;
}

export default App;
