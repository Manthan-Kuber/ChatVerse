import { SessionProvider, useSession } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "../components/Layout";
import CustomHead from "../components/CustomHead";
import Auth from "../components/Auth";
import { Toaster } from "react-hot-toast";

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
          <Toaster />
          {Component.auth ? (
            <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
          ) : (
            getLayout(<Component {...pageProps} />)
          )}
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

export default MyApp;
