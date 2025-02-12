import { signIn } from "next-auth/react";


export default function Login() {
  const handleLogin = () => {
    signIn("spotify", { callbackUrl: "http://localhost:3000" });
  };
  
  return (
    <div className="flex items-center justify-center w-full h-screen animate-background  ">
      <div className="bg-black bg-opacity-40 h-2/3 w-1/2 flex flex-col rounded-3xl text-center justify-start items-center gap-10">
      <h1 className="font-atkinson-hyperlegible text-6xl mt-20 ">betterfy</h1>
      <p className=" font-atkinson-hyperlegible text-lg">An improved UI for the spotify player</p>
      <button
        onClick={handleLogin}
        className=" text-lg font-semibold text-white  bg-black bg-opacity-40 hover:bg-opacity-20 rounded-lg  transition-all duration-300 font-atkinson-hyperlegible px-5 py-4
        w-1/3">
        Login with Spotify
      </button>
      <button
       
        className=" text-lg font-semibold text-white  bg-black bg-opacity-40 hover:bg-opacity-20 rounded-lg  transition-all duration-300 font-atkinson-hyperlegible px-5 py-4
        w-1/3">
        About
      </button>
      </div>
      
    </div>
  );
}