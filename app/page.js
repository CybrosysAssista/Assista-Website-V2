import Image from "next/image";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import TwoBox from "./components/Video";
import Feature from "./components/Feature";
import CaseStudies from "./components/MoreFeatures";
import Products from "./components/Products";
import FAQ from "./components/Faq";

export default function Home() {
  return (
    <div>
      <Header />
      <div className="overflow-hidden">
        <Hero />
        <TwoBox />
      </div>
      <Feature />
      <Products />
      <CaseStudies />
      <FAQ />
      <Footer />
    </div>
  );
}
