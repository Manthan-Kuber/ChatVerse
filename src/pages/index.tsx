import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";

const Home: NextPage = () => {
  const { data: session } = useSession();
  session && console.log(session);

  const handleAuth = () => (session ? signOut() : signIn());

  return (
    <>
      <Head>
        <title>ChatVerse</title>
        <meta name="description" content="ChatVerse - a chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-extrabold leading-normal text-gray-700 md:text-[5rem]">
          Chat<span className="text-lime-300">Verse</span>
        </h1>
        {session ? (
          <h1 className="text-3xl font-bold ">
            You are signed in as {session.user?.email}
          </h1>
        ) : (
          <>
            <h1 className="text-3xl font-bold ">
              Not Signed In, Please Sign in
            </h1>
          </>
        )}
        <button
          onClick={handleAuth}
          className="text- mt-2 rounded-md border border-gray-700 px-2  pb-1 text-2xl font-semibold text-gray-500"
        >
          {session ? "SignOut" : "SignIn"}
        </button>
      </main>
    </>
  );
};

export default Home;
