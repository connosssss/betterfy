import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";



//gittest
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <title>betterfy</title>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default MyApp;