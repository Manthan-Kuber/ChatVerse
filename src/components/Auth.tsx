import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import ChatVerseText from "./ChatVerseText";

function Auth({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const { replace } = useRouter();

  if (status === "loading") {
    return (
      <div className="grid min-h-screen w-full  place-items-center text-2xl">
        <ChatVerseText className="animate-pulse" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    replace("/auth/signin");
    return null;
  }

  return <>{children}</>;
}

export default Auth;
