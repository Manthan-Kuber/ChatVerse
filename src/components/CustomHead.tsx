import Head from "next/head";
import { useRouter } from "next/router";

const CustomHead = () => {
  const { pathname } = useRouter();
  const defaultTitle =
    pathname.split("/")[1]?.toUpperCase()[0] +
    pathname.split("/")[1]?.substring(1)!;
  const getCurrTitle = () => {
    switch (pathname) {
      case "/":
        return " - Home";
      case "/auth/signin":
        return " - SignIn";
      default:
        return `- ${defaultTitle}`;
    }
  };
  return (
    <Head>
      {/* Title element should strictly have a single child */}
      <title>{`ChatVerse ${getCurrTitle()}`}</title>
      <meta name="description" content="ChatVerse - a chat app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};
export default CustomHead;
