import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ChatVerseLoader from "./ChatVerseLoader";

function Auth({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { replace } = useRouter();

  if (status === "loading") {
    return <ChatVerseLoader fullScreen />;
  }

  if (status === "unauthenticated") {
    replace("/auth/signin");
    return <ChatVerseLoader fullScreen />;
  }

  return <>{children}</>;
}

export default Auth;
