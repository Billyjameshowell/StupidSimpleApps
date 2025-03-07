import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="bg-primary-50 text-primary-800 scroll-smooth">
      <Header />
      {children}
      <Footer />
    </div>
  );
}
