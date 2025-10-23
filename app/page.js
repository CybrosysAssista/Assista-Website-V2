import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TwoBox from "./components/TwoBox";
import Feature from "./components/Feature";
import CaseStudies from "./components/CaseStudies";
import Products from "./components/Products";

export default function Home() {
  return (
    <div>
      <Header />
      <Hero />
      <TwoBox />
      <Feature />
      <Products />
      <CaseStudies />
      <Footer />
    </div>
  );
}
