import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="grid min-h-screen grid-rows-[auto_1fr_auto]   ">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
