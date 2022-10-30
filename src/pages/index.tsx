import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";
import { BsGithub } from "react-icons/bs";
import ThemeButton from "../components/ThemeButton";

const Home: NextPage = () => {
  // const { data: session } = useSession();
  // const { push, asPath } = useRouter();
  // session && console.log(session);
  // const handleAuth = () => {
  //   if (!session) push(`/auth/signin?callbackUrl=${asPath}`);
  //   else signOut({ redirect: false });
  // };

  return (
    <>
      <ThemeButton />
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4 ">
        <Image
          src="/undraw_group_chat_re_frmo.svg"
          width={240}
          height={240}
          alt="logo"
          className="mx-auto md:mb-4 md:w-[320px] "
        />
        <h1 className="font-ubuntu text-5xl font-extrabold leading-normal text-gray-700 md:text-6xl">
          Chat<span className="text-lime-300">Verse</span>
        </h1>
        {/* {session ? (
          <>
            <h1 className="text-5xl font-bold md:text-3xl">
              You are signed in as {session.user?.email}
            </h1>
            <p>{session.user?.name}</p>
            <Image
              src={`${session.user?.image}`}
              alt={`${session.user?.name}'s profile pic`}
              width={200}
              height={200}
            ></Image>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold md:text-3xl ">
              Not Signed In, Please Sign in
            </h1>
          </>
        )} */}
        <div className="mt-4 flex gap-4 md:mt-8">
          <a
            className="font flex items-center gap-2 rounded-md border border-white bg-neutral-800 px-3 py-1 font-semibold text-white transition-all duration-200 hover:bg-neutral-700 dark:border-neutral-500"
            href="https://github.com/Manthan-Kuber/ChatVerse"
            target="_blank"
            rel="noreferer"
          >
            <BsGithub />
            Github
          </a>
          <button className="rounded-md border border-white  bg-neutral-800 px-3 py-1 font-semibold text-white transition-all duration-200 hover:bg-neutral-700 dark:border-neutral-500">
            Get Started
          </button>
        </div>
      </main>
    </>
  );
};

export default Home;
