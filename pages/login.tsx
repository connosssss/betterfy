"use client"
import { signIn } from "next-auth/react";

export default function Login() {

    const handleLogin = () => {
      signIn("spotify", { callbackUrl: "http://localhost:3000" });
    };
  
    return (
        <div className="flex items-center justify-center ">
          <button
            className="bg-slate-800 w-1/6 "
            onClick={handleLogin}>
            Login
          </button>
        </div>
    );
  }