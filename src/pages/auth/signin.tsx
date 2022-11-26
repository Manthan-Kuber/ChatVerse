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
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const callbackUrl = "/chats";

const SocialIconsList = [
  { id: 0, name: "google", iconType: BsGoogle },
  { id: 1, name: "discord", iconType: FaDiscord },
  { id: 2, name: "github", iconType: BsGithub },
  // { id: 3, iconType: BsTwitter }, Change Later
].map(({ iconType, id, name }) => (
  <li
    key={id}
    onClick={async () => {
      try {
        const res = await signIn(name, { redirect: false, callbackUrl });
        res && res.url && useRouter().push(res.url);
      } catch (err) {
        console.log(err);
      }
    }}
  >
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
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const { push, replace } = useRouter();
  const { status } = useSession();

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "authenticated") {
    replace(callbackUrl);
    return <></>;
  }
  const onSubmit: SubmitHandler<FormValues> = async ({ email }) => {
    try {
      const res = await signIn("email", {
        redirect: false,
        email,
        callbackUrl,
      });
      if (res?.ok && res?.url) {
        reset();
        push(res.url);
      }
    } catch (err) {
      console.log(err);
    }
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
            <button
              className="mt-2 w-full rounded-lg bg-gradient-to-l from-lime-500 to-green-500  px-4 py-2 font-sans font-semibold tracking-wider text-white transition-all duration-200 hover:from-lime-600 hover:to-green-600 disabled:cursor-not-allowed disabled:from-lime-600 disabled:to-green-600"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader /> : "Sign In With Magic Link 🔮"}
            </button>
            <p className="mt-2 w-full text-center text-sm text-neutral-500 dark:text-white/70 ">
              Please check spam folder as well for the email
            </p>
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
