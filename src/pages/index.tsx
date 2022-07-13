import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const HomeContents = () => {
  const { data, status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (!data)
    return (
      <div>
        <div>Please log in</div>
        <button onClick={() => signIn("twitch")}>Sign in with Twitch</button>
      </div>
    );

  return (
    <div className="flex flex-col">
      Hello {data.user?.name}
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

const Home: NextPage = () => {
  const hello = trpc.useQuery(["example.hello", { text: "from tRPC" }]);

  return (
    <>
      <Head>
        <title>Stream Q&A Tool</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HomeContents />
    </>
  );
};

export default Home;
