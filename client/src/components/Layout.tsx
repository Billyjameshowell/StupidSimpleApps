import { ReactNode, memo } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-primary-50 text-primary-800 scroll-smooth">
      <Header />
      {children}
      <Footer />
    </div>
  );
}

export default memo(Layout);
