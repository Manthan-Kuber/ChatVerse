import Header from "./Header";
import Head from "next/head";
import { useRouter } from "next/router";

const Layout = ({ children }: { children: React.ReactElement }) => {
  const { pathname } = useRouter();
  return (
    <>
      <Head>
        <title>ChatVerse - {pathname === "/" ? "Home" : pathname}</title>
        <meta name="description" content="ChatVerse - a chat app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid min-h-screen grid-rows-[auto_1fr]   ">
        <Header />
        <main>{children}</main>
      </div>
    </>
  );
};

export default Layout;
