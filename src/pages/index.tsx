import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import { AiOutlineRight } from "react-icons/ai";
import ChatVerseText from "../components/ChatVerseText";
import { motion } from "framer-motion";
import { fadeInOut, fadeInUp, stagger } from "../animations/animations";

const Home: NextPage = () => {
  const { data: session } = useSession();

  const MotionLink = motion(Link);

  return (
    <motion.section
      className="centered-section"
      key="main_section" //Required for exit animation
      variants={fadeInOut}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Image
        src="/undraw_group_chat_re_frmo.svg"
        width={240}
        height={240}
        alt="logo"
        className="mx-auto md:mb-4 md:w-[320px] "
      />
      <ChatVerseText />
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
          className="link-btn flex items-center gap-2"
          href="/chats"
          variants={fadeInUp}
          whileTap={{ scale: 0.95 }}
        >
          Start Chatting
          <AiOutlineRight className="animate-sideSway" />
        </MotionLink>
      </motion.div>
    </motion.section>
  );
};

export default Home;
