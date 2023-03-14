import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ChatVerseLoader from "./ChatVerseLoader";

function Auth({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { replace } = useRouter();

  if (status === "loading") {
    return <ChatVerseLoader />;
  }

  if (status === "unauthenticated") {
    replace("/auth/signin");
    return <ChatVerseLoader />;
  }

  return <>{children}</>;
}

export default Auth;
