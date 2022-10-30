import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import "../styles/globals.css";
import Head from "next/head";
import { useRouter } from "next/router";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const { asPath } = useRouter();
  return (
    <>
      <Head>
        <title>ChatVerse - {asPath === "/" ? "Home" : asPath}</title>
        <meta name="description" content="ChatVerse - a chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider attribute="class" enableSystem>
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </>
  );
};

export default MyApp;
