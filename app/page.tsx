import { GetServerSideProps } from "next";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <div className="">
      asdf
    </div>
  );
}


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  

  if (!(await session)) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

    return {
      props: {},
    };
  }
