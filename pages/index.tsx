import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import { getSession } from "next-auth/react";
import Player from "../components/player";

interface CustomSession {
  accessToken?: string;
}

export default function Home() {
  const { data: session } = useSession() as { data: CustomSession | null };

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div className="">
      <Player accessToken={session.accessToken!} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
};