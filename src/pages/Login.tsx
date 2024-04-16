import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "../components/ui/use-toast";
import { useUser } from "../components/UserContext";
import { useAuthenticatedRequest } from "../authenticatedRequest";

export const Login = () => {
  const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated, getAccessTokenSilently, user } =
      useAuth0();
    const navigate = useNavigate();
    const sendRequest = useAuthenticatedRequest();
    const { loginUserContext } = useUser();
    const checkUser = async () => {
      try {
        if (isAuthenticated) {
          await getAccessTokenSilently();
          if (user) {
            const response = await sendRequest(`/users/`, {
              method: "POST",
              data: {
                email: user.email,
                name: user.name,
                id: user.sub,
                photoUrl: user.picture,
              },
            });
            loginUserContext(response.data[0].id);
          }
          navigate("/landing/dashboard");
        }
      } catch (error) {
        console.error("Error during login process:", error);
        toast({
          title: "Error during login process:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify((error as Error).message, null, 2)}
              </code>
            </pre>
          ),
        });
      }
    };

    useEffect(() => {
      checkUser();
    }, [isAuthenticated]);

    return (
      <div
        className={cn(
          buttonVariants({ variant: "default", size: "lg" })
          // "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        <button onClick={() => loginWithRedirect()}>Login / Signup</button>
      </div>
    );
  };
  return (
    <>
      <div
        className="flex flex-col space-x-8"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/01.webp)`,
        }}
      ></div>
      <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
        <div className="flex items-center justify-center py-12">
          <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
              <h1 className="text-3xl font-bold">Stock Trackr</h1>
            </div>
            <div className="grid gap-4">
              <LoginButton />
            </div>
          </div>
        </div>
        <div className="hidden bg-muted lg:block">
          <img
            src={`${process.env.PUBLIC_URL}/01.webp`}
            height={"1080"}
            width={"1920"}
            alt="Sample"
            className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          />
        </div>
      </div>
    </>
  );
};
