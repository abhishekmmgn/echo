import Auth from "@/components/views/auth";
import Home from "@/components/views/home";
import { useAuth0 } from "@auth0/auth0-react";
import { DefaultSkeleton } from "./components/default-loading";
import { useCurrentUser } from "@/store";
import { useEffect, useState } from "react";
import api from "@/api/axios";
import Cookies from "universal-cookie";
import { BasicDetailsType } from "./types";
import { isAxiosError } from "axios";

function App() {
  const [error, setError] = useState(false);
  const { isAuthenticated, isLoading, user } = useAuth0();
  const { uid, changeCurrentUser } = useCurrentUser();

  async function createAccount() {
    try {
      const res = await api.post("/current_user", {
        name: user?.name,
        email: user?.email,
        avatar: user?.picture || null,
      });
      const data: BasicDetailsType = res.data.data;
      console.log(res.data);
      changeCurrentUser(data.id, data.name, data.avatar, data.email);
      // save id to cookies
      const cookies = new Cookies();
      cookies.set("id", data.id);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  }
  async function fetchCurrentUser() {
    try {
      const res = await api.get(`/current_user?email=${user?.email!}`);
      const data: BasicDetailsType = res.data.data;
      // console.log("D: ", data);
      if (!data.id) {
        console.log("User not found");
        createAccount();
      } else if (data.id) {
        console.log("User found");
        const cookies = new Cookies();
        cookies.set("id", data.id);
        changeCurrentUser(data.id, data.name, data.avatar, data.email);
      }
    } catch (err) {
      if (isAxiosError(err) && err?.response?.status! === 404) {
        console.log("User not found");
        createAccount();
      } else {
        setError(true);
      }
    }
  }
  useEffect(() => {
    if (isAuthenticated && !uid) {
      console.log("In: Run");
      fetchCurrentUser();
    }
    console.log("Run");
  }, [isAuthenticated, uid]);

  if (error) {
    return (
      <div className="h-screen w-screen grid place-items-center">
        <p className="text-destructive selection:bg-destructive">
          Something went wrong
        </p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="h-screen w-screen grid place-items-center">
        <DefaultSkeleton />
      </div>
    );
  }
  if (isAuthenticated) {
    if (uid) {
      return <Home />;
    } else {
      return (
        <div className="h-screen w-screen grid place-items-center">
          <DefaultSkeleton />
        </div>
      );
    }
  } else {
    return <Auth />;
  }
}

export default App;
