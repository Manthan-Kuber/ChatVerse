import { motion } from "framer-motion";
import ChatVerseText from "../../components/ChatVerseText";
import Input from "../../components/Input";
import SocialIcon from "../../components/SocialIcon";
import { BsTwitter, BsGithub, BsGoogle } from "react-icons/bs";
import { FaDiscord } from "react-icons/fa";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from "../../components/Loader";
import { signIn } from "next-auth/react";

const SocialIconsList = [
  { id: 0, name: "google", iconType: BsGoogle },
  { id: 1, name: "discord", iconType: FaDiscord },
  { id: 2, name: "github", iconType: BsGithub },
  // { id: 3, iconType: BsTwitter }, Change Later
].map(({ iconType, id, name }) => (
  <li key={id} onClick={() => signIn(name)}>
    <SocialIcon Icon={iconType} />
  </li>
));

type FormValues = {
  email: string;
};

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Please enter a valid email" }),
});

const Signin = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = ({ email }) => {
    signIn("email", { email });
    reset();
  };

  return (
    <motion.section
      className="md:centered-section px-auto mx-auto mt-[4%] min-h-full w-[min(100%,473px)] md:mt-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className=" rounded-3xl p-4 md:p-8 md:shadow-lg  md:shadow-neutral-500 ">
        <ChatVerseText textSize="text-xl" mdTextSize="md:text-2xl" />
        <h2 className="text-md mt-2 mb-6 text-neutral-600 dark:text-white/50 md:text-lg">
          Start Chatting Now!
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            inputName="email"
            label="Email"
            placeholder="Enter your email"
            register={register}
            type="email"
            isError={!!errors.email?.message}
            errorMessage={errors.email?.message ? errors.email.message : ""}
          />
          <div className="mt-8">
            <p className="w-full text-center text-sm text-neutral-500 dark:text-white/70 ">
              Sign In with a one-time link
            </p>
            {/* disable button while loading */}
            <button
              className="mt-2 w-full rounded-lg bg-gradient-to-l from-lime-500 to-green-500  px-4 py-2 font-sans font-semibold tracking-wider text-white transition-all duration-200 hover:from-lime-600 hover:to-green-600 "
              type="submit"
            >
              {/*Condition from useSession's loading prop */}
              {false ? <Loader /> : "Sign In With Magic Link 🔮"}
            </button>
          </div>
        </form>
        <div>
          <div className=" mt-8 flex items-center gap-2">
            <hr className="w-full" />
            <p className="line">Or</p>
            <hr className="w-full" />
          </div>
          <p className="mt-4 text-center text-neutral-500 dark:text-white/50">
            Continue with your social profile
          </p>
          <ul className="mx-auto mt-4 flex w-3/4 justify-evenly">
            {SocialIconsList}
          </ul>
        </div>
      </div>
    </motion.section>
  );
};

export default Signin;
