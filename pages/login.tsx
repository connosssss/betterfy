import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleLogin = () => {
    if (agreedToTerms) {
      signIn("spotify", { callbackUrl: "http://localhost:3000/" });
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-screen animate-background">
      
      <div className="bg-black bg-opacity-40 h-2/3 w-1/2 flex flex-col rounded-3xl text-center justify-start items-center gap-6">
        <h1 className="font-atkinson-hyperlegible text-6xl mt-14">betterfy</h1>
        <p className="font-atkinson-hyperlegible text-lg">An improved UI for the spotify player</p>
        
        <div className="flex items-center mt-2 mb-1">
          <input
            type="checkbox"
            id="agreement-checkbox"
            checked={agreedToTerms}
            onChange={(e) => setAgreedToTerms(e.target.checked)}
            className="mr-2 h-4 w-4"
          />
          <label htmlFor="agreement-checkbox" className="font-atkinson-hyperlegible text-sm">
            I have read and agree to the{" "}
            <Link href="/agreement" className="text-blue-300 hover:underline">
              End User Agreement
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-blue-300 hover:underline">
              Privacy Policy
            </Link>

            
          </label>
        </div>
        
        <button
          onClick={handleLogin}
          disabled={!agreedToTerms}
          className={`text-lg font-semibold text-white bg-black ${
            agreedToTerms ? "bg-opacity-40 hover:bg-opacity-20" : "bg-opacity-20 cursor-not-allowed"
          } rounded-lg transition-all duration-300 font-atkinson-hyperlegible px-5 py-4 w-1/3`}
        >
          Login with Spotify
        </button>
        
        <button
          onClick={() => window.location.href = "/about"}
          className="text-lg font-semibold text-white bg-black bg-opacity-40 hover:bg-opacity-20 rounded-lg transition-all duration-300 font-atkinson-hyperlegible px-5 py-4 w-1/3"
        >
          About
        </button>
      </div>
    </div>
  );
}