import { motion } from "framer-motion";
import ChatVerseText from "../../components/ChatVerseText";
import Input from "../../components/Input";
import SocialIcon from "../../components/SocialIcon";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Loader from "../../components/Loader";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ChatVerseLoader from "../../components/ChatVerseLoader";

const callbackUrl = "/chats";

const SocialIconsList = [
  {
    name: "google",
    iconType: FcGoogle,
    color: "#DB4437",
    borderColor: "border-[#DB4437]",
  },
  {
    name: "discord",
    iconType: FaDiscord,
    color: "#7289DA",
    borderColor: "border-[#7289DA]",
  },
  {
    name: "github",
    iconType: BsGithub,
    color: "",
    borderColor: "border-[#525252] dark:border-white",
  },
].map(({ iconType, name, color, borderColor }) => {
  return (
    <li
      key={name}
      onClick={async () => {
        try {
          const res = await signIn(name, { redirect: false, callbackUrl });
          res && res.url && useRouter().push(res.url);
        } catch (err) {
          console.log(err);
        }
      }}
    >
      <div
        className={`flex w-fit cursor-pointer items-center gap-2 rounded-md border ${borderColor} p-2 transition-all duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-600`}
      >
        <SocialIcon Icon={iconType} color={color} />
        <span className="text-neutral-600 dark:text-white">
          {name.charAt(0).toUpperCase() + name.slice(1)}
        </span>
      </div>
    </li>
  );
});

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
    return <ChatVerseLoader />;
  }

  if (status === "authenticated") {
    replace(callbackUrl);
    return <ChatVerseLoader />;
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
        <div className="mb-8 flex items-center justify-center gap-1">
          <h2 className="-mb-0.5 text-lg text-neutral-600 dark:text-white/50 md:text-xl">
            Sign In to
          </h2>
          <ChatVerseText textSize="text-xl" mdTextSize="md:text-2xl" />
        </div>
        <div>
          <ul className="mx-auto mt-4 flex w-3/4 justify-evenly gap-4">
            {SocialIconsList}
          </ul>
          <div className="my-6 flex items-center gap-2">
            <div className="h-0.5 w-full bg-gradient-to-l from-black to-transparent dark:from-white" />
            <p className="line">OR</p>
            <div className="h-0.5 w-full bg-gradient-to-r from-black to-transparent dark:from-white " />
          </div>
        </div>
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
          <div className="mt-4">
            <button
              className="mt-2 w-full rounded-lg bg-gradient-to-l from-lime-500 to-green-500  px-4 py-2 font-sans font-semibold tracking-wider text-white transition-all duration-200 hover:from-lime-600 hover:to-green-600 disabled:cursor-not-allowed disabled:from-lime-600 disabled:to-green-600"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader /> : "Sign In With Magic Link 🔮"}
            </button>
            <p className="my-4 w-full text-center text-sm text-neutral-500 dark:text-white/70 ">
              Please check spam folder as well for the email
            </p>
          </div>
        </form>
      </div>
    </motion.section>
  );
};

export default Signin;
