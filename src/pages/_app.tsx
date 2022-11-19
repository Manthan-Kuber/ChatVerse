import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "../components/Layout";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import Loader from "../components/Loader";
import CustomHead from "../components/CustomHead";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout & { auth: boolean; unauthorized: string };
};

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>); //Default Layout if no per page layout
  return (
    <>
      <CustomHead />
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" enableSystem>
          <AnimatePresence mode="wait">
            {Component.auth ? (
              <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
            ) : (
              getLayout(<Component {...pageProps} />)
            )}
          </AnimatePresence>
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

export default MyApp;

function Auth({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const { replace } = useRouter();

  if (status === "loading") {
    return <Loader />;
  }

  if (status === "unauthenticated") {
    replace("/auth/signin");
    return null;
  }

  return <>{children}</>;
}
