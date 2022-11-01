import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { BsGithub } from "react-icons/bs";
import ChatVerseText from "../components/ChatVerseText";
import { motion } from "framer-motion";
import { fadeInUp, stagger } from "../animations/animations";
import { AnimatePresence } from "framer-motion";

const Home: NextPage = () => {
  // const { data: session } = useSession();
  // const { push, asPath } = useRouter();
  // session && console.log(session);
  // const handleAuth = () => {
  //   if (!session) push(`/auth/signin?callbackUrl=${asPath}`);
  //   else signOut({ redirect: false });
  // };

  const MotionLink = motion(Link);

  return (
    <>
      <motion.section
        className="centered-section"
        key="main_section" //Required for exit animation
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Image
          src="/undraw_group_chat_re_frmo.svg"
          width={240}
          height={240}
          alt="logo"
          className="mx-auto md:mb-4 md:w-[320px] "
        />
        <ChatVerseText />
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
        <motion.div
          className="mt-4 flex gap-4 md:mt-8 "
          variants={stagger}
          initial="initial"
          animate="animate"
        >
          <motion.a
            className="link-btn flex items-center gap-2"
            href="https://github.com/Manthan-Kuber/ChatVerse"
            target="_blank"
            rel="noreferer"
            variants={fadeInUp}
            whileTap={{ scale: 0.95 }}
          >
            <BsGithub />
            Github
          </motion.a>
          <MotionLink
            className="link-btn"
            href="/auth/signin"
            variants={fadeInUp}
            whileTap={{ scale: 0.95 }}
          >
            Start Chatting
          </MotionLink>
        </motion.div>
      </motion.section>
    </>
  );
};

export default Home;
