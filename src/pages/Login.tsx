import React, { useEffect } from "react";
import { cn } from "../lib/utils";
import { buttonVariants } from "../components/ui/button";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const LoginButton = () => {
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const navigate = useNavigate();

    useEffect(() => {
      if (isAuthenticated) {
        navigate("/dashboard");
      }
    }, [isAuthenticated]);

    return (
      <div
        className={cn(
          buttonVariants({ variant: "outline", size: "lg" }),
          "absolute right-4 top-4 md:right-8 md:top-8"
        )}
      >
        <button onClick={() => loginWithRedirect()}>Login / Signup</button>
      </div>
    );
  };

  return (
    <>
      <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <LoginButton />
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            StockTrackr
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;As a small business owner, keeping track of inventory was
                always a headache. With StockTrackr, I can easily manage stock
                levels, track product movements, and generate reports with just
                a few clicks. It has saved me countless hours of manual work and
                helped streamline our operations.&rdquo;
              </p>
              <footer className="text-sm">Sofia Davis</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Try it!</h1>
              <p className="text-sm text-muted-foreground">
                Click the button on the top right to begin
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};