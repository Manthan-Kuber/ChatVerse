import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "../components/Loader";

function Auth({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { replace } = useRouter();

  if (status === "loading") {
    return <Loader />; //TODO Add full screen loader here
  }

  if (status === "unauthenticated") {
    replace("/auth/signin");
    return null;
  }

  return <>{children}</>;
}

export default Auth;
