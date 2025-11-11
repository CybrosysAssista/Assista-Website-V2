import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

function page() {
  return (
    <div>
      <Header />
      <div className="pt-40 pb-10">
        <div className="container-fluid cmpad">
          <div className="mb-10">
            <h2 className="mainhead relative w-max m-auto">
              Discover the Vision{" "}
              <span className="brush relative">
                <Image
                  src="/img/arrow.svg"
                  alt=""
                  width={100}
                  height={100}
                  className="absolute -right-25 -top-6"
                />{" "}
                with Assista
              </span>
            </h2>
            <p className="max-w-2xl text-center mx-auto text-[#58586b] leading-relaxed">
              Assista by Cybrosys empowers businesses with AI-driven automation
              to simplify workflows, boost productivity, and drive smarter
              growth.
            </p>
            <nav className="breadcrumb justify-center mt-5 text-sm sm:text-base">
              <a href="#">Home</a>
              <span>›</span>
              <span className="active">About Us</span>
            </nav>
          </div>

          <div className="p-4 sm:p-6 md:p-10 mb-5">
            <div className="grid lg:grid-cols-12 gap-8 md:gap-10">
              <div className="col-span-12 lg:col-span-6 flex flex-col justify-center order-1">
                <h2 className="text-5xl mb-6 relative leading-15 md:leading-normal">
                  Experience the
                  <br /> Future with{" "}
                  <span className="underlineimg">Assista</span>
                </h2>

                <p className="text-[#58586b] leading-relaxed mb-3">
                  Assista simplifies the way teams work by merging automation
                  and AI into everyday business processes. It eliminates
                  complexity, empowering users to focus on creativity,
                  collaboration, and growth.
                </p>
                <p className="text-[#58586b] leading-relaxed mb-5">
                  With adaptive tools, seamless integration, and human-centric
                  design, Assista helps organizations operate smarter, make
                  informed decisions, and scale effortlessly.
                </p>
                <div className="flex flex-wrap gap-6 sm:gap-8">
                  <div className="item flex gap-2">
                    <span className="checkmark"></span>
                    <span className="text">AI Automation</span>
                  </div>
                  <div className="item flex gap-2">
                    <span className="checkmark"></span>
                    <span className="text">Seamless Integration</span>
                  </div>
                  <div className="item flex gap-2">
                    <span className="checkmark"></span>
                    <span className="text">Scalable Cloud Platform</span>
                  </div>
                  <div className="item flex gap-2">
                    <span className="checkmark"></span>
                    <span className="text">AI Automation</span>
                  </div>
                  <div className="item flex gap-2">
                    <span className="checkmark"></span>
                    <span className="text">Seamless Integration</span>
                  </div>
                  <div className="item flex gap-2">
                    <span className="checkmark"></span>
                    <span className="text">Scalable Cloud Platform</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 lg:col-span-6 order-2">
                <img
                  src="/img/about1.png"
                  alt="Team collaborating using Easy Instance platform"
                  className="mx-auto w-full h-auto max-w-xs sm:max-w-md md:max-w-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default page;
