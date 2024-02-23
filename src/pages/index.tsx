import { type NextPage } from "next";
import Image from "next/image";
import { BsGithub } from "react-icons/bs";
import ChatVerseText from "../components/ChatVerseText";
import { motion } from "framer-motion";
import { fadeInOut, fadeInUp, stagger } from "../animations/animations";
import { useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import { useRouter } from "next/router";
import { shimmer, toBase64 } from "../utils/functions";

const Home: NextPage = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { push } = useRouter();

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
        priority
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(240, 240))}`}
        placeholder="blur"
        width={240}
        height={240}
        alt="logo"
        className="mx-auto md:mb-4 md:w-[320px] "
      />
      <ChatVerseText />
      <motion.div
        className="mt-4 flex gap-4 md:mt-8 "
        variants={stagger}
        initial={!hasAnimated && "initial"}
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
        <motion.button
          className="link-btn flex items-center gap-2"
          variants={fadeInUp}
          whileTap={{ scale: 0.95 }}
          disabled={isDisabled}
          onClick={() => {
            setIsDisabled(true);
            setHasAnimated(true);
            push("/chats");
          }}
        >
          <RotatingLines
            strokeColor="grey"
            strokeWidth="5"
            animationDuration="0.75"
            width="24"
            visible={isDisabled}
          />
          Start Chatting
        </motion.button>
      </motion.div>
    </motion.section>
  );
};

export default Home;
