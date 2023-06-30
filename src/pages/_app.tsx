import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import Layout from "../components/Layout";
import CustomHead from "../components/CustomHead";
import Auth from "../components/Auth";
import { Toaster } from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import "react-tooltip/dist/react-tooltip.css";
import { SkeletonTheme } from "react-loading-skeleton";
import { SWRConfig } from "swr";
import { fetcher } from "../utils/functions";
import NextNProgress from "nextjs-progressbar";

export type NextPageWithLayout<P = Record<string, never>, IP = P> = NextPage<
  P,
  IP
> & {
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
    <SkeletonTheme
      baseColor="rgb(163 163 163 / 0.1)"
      highlightColor="rgb(163 163 163 / 0.1)"
    >
      <CustomHead />
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" enableSystem>
          <SWRConfig value={{ fetcher }}>
            <Toaster
              toastOptions={{
                className: "custom-toast",
              }}
            />
            <NextNProgress
              color="#bef264"
              showOnShallow={false}
              options={{ showSpinner: false }}
            />
            {Component.auth ? (
              <Auth>{getLayout(<Component {...pageProps} />)}</Auth>
            ) : (
              getLayout(<Component {...pageProps} />)
            )}
          </SWRConfig>
        </ThemeProvider>
      </SessionProvider>
    </SkeletonTheme>
  );
};

export default MyApp;
