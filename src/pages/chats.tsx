import { Head } from "next/document";
import { ReactElement } from "react";
import Footer from "../components/Footer";
import { NextPageWithLayout } from "./_app";

const chats = () => {
  return <main>chats</main>; //TODO main and a section
};
export default chats;

chats.getLayout = function getLayout(page: ReactElement) {
  return (
    <>
      <div>{page}</div>
      <Footer />
    </>
  );
};
chats.auth = true; // Protect the page using Auth Parent Component
