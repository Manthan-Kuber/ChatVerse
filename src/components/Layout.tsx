import Header from "./Header";
import Head from "next/head";
import { useRouter } from "next/router";

const Layout = ({ children }: { children: React.ReactElement }) => {
  const { pathname } = useRouter();
  const getCurrTitle = () => {
    switch (pathname) {
      case "/":
        return " - Home";
      case "/auth/signin":
        return " - SignIn";
      default:
        return "";
    }
  };
  return (
    <>
      <Head>
        {/* Title element should strictly have a single child */}
        <title>{`ChatVerse ${getCurrTitle()}`}</title>
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
