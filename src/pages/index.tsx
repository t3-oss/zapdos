import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import { signIn, signOut, useSession } from "next-auth/react";
import { getZapdosAuthSession } from "../server/common/get-server-session";

import LoadingSpinnerSVG from "../assets/puff.svg";
import Image from "next/image";

const copyUrlToClipboard = (path: string) => () => {
  if (!process.browser) return;
  navigator.clipboard.writeText(`${window.location.origin}${path}`);
};

const NavButtons: React.FC<{ userId: string }> = ({ userId }) => {
  const { mutate: unpinQuestion } = trpc.useMutation([
    "questions.unpin-question",
  ]);

  return (
    <div className="flex gap-2">
      <button onClick={copyUrlToClipboard(`/embed/${userId}`)}>
        Copy embed url
      </button>
      <button onClick={copyUrlToClipboard(`/ask/${userId}`)}>
        Copy Q&A url
      </button>
      <button onClick={() => unpinQuestion()}>Unpin</button>
      <button onClick={() => signOut()}>Logout</button>
    </div>
  );
};

const QuestionsView = () => {
  const { data, isLoading } = trpc.useQuery(["questions.get-my-questions"]);

  const { mutate: pinQuestion } = trpc.useMutation(["questions.pin-question"]);

  if (isLoading) return <Image src={LoadingSpinnerSVG} alt={"Loading..."} />;

  return (
    <div className="flex flex-col gap-4 animate-fade-in-down">
      {data?.map((q) => (
        <div
          key={q.id}
          className="p-4 bg-gray-600 rounded flex justify-between"
        >
          {q.body}
          <button onClick={() => pinQuestion({ questionId: q.id })}>Pin</button>
        </div>
      ))}
    </div>
  );
};

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
    <div className="flex flex-col p-8">
      <div className="flex justify-between w-full">
        <h1 className="text-2xl font-bold">Questions For {data.user?.name}</h1>
        <NavButtons userId={data.user?.id!} />
      </div>
      <div className="p-4" />
      <QuestionsView />
    </div>
  );
};

const Home: NextPage = () => {
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  return {
    props: {
      session: await getZapdosAuthSession(ctx),
    },
  };
};

export default Home;
