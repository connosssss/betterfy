import NextAuth from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";

const scope = "user-read-email user-top-read"; 

export default NextAuth({

  providers: [
    SpotifyProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: {
        url: "https://accounts.spotify.com/authorize",
        params: { scope },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {

    async jwt({ token, account }) {
        if (account) {
            token.id = account.id;
            token.expires_at = account.expires_at;
            token.accessToken = account.access_token;
          }
          return token;
      },
    
      async session({ session, token }) {
        session.accessToken = token.accessToken;
        return session;
      },

      pages: {
    signIn: "/login",
  },
  },
});