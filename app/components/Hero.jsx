import Image from "next/image";
import React from "react";

function Hero() {
  return (
    <div className="h-screen pt-10 slider">
      <div className="cmpad h-full flex items-center relative">
        <Image
          src="/img/globe.svg"
          alt="Globe"
          width={300}
          height={300}
          className="globe"
        />

        <div className="w-full">
          <div className="grid grid-cols-2 gap-10 w-full">
            <div>
              <h1 className="text-5xl font-medium mb-3 leading-15">
                Your smart partner to
                <br /> Learn more{" "}
                {/* <span className="underlineimg">
                  <Image
                    src="/img/arrow.svg"
                    alt=""
                    width={100}
                    height={100}
                    className="absolute -right-25 -top-6"
                  />
                  build faster.
                </span> */}
                <span className="brush relative">
                  <Image
                    src="/img/arrow.svg"
                    alt=""
                    width={100}
                    height={100}
                    className="absolute -right-25 -top-6"
                  />
                  build faster.
                </span>
              </h1>
              <p className="max-w-[600px] leading-7 text-[#7e7e7e]">
                A platform that offers a range of utilities including
                development plugins a learning hub ready to use installation
                scripts cheat sheets and more.
              </p>
              <div className="flex gap-2 mt-10 mb-15">
                <a
                  href=""
                  className="flex justify-center items-center w-45 py-3 bg-[var(--primary-color)] text-white rounded-full hover:bg-[#666] transition duration-300"
                >
                  Get Started
                </a>
                <a
                  href=""
                  className="text-center w-45 py-3 text-[#333] bg-[#94939328] border-[#88848425] border-2 rounded-full hover:bg-[#666] hover:border-[#666] hover:text-white transition duration-300"
                >
                  Contact Us
                </a>
              </div>

              <div className="trust-container">
                <div className="avatars">
                  <div className="avatar avatar-1">
                    <Image src="/img/user1.png" alt="" width={60} height={60} />
                  </div>
                  <div className="avatar avatar-2">
                    <Image src="/img/user2.png" alt="" width={60} height={60} />
                  </div>
                  <div className="avatar avatar-3">
                    <Image src="/img/user3.png" alt="" width={60} height={60} />
                  </div>
                  <div className="plus-badge">98+</div>
                </div>

                <div className="divider"></div>

                <div className="trust-text">
                  <div className="trust-number">Trusted by 20k+</div>
                  <div className="trust-description">
                    Total Clients Across the Globe
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="icon">
                <Image src="/img/icon1.svg" alt="JS" width={40} height={40} />
              </div>

              <div className="icon">
                <Image
                  src="/img/assista-air.svg"
                  alt="JS"
                  width={40}
                  height={40}
                />
              </div>
              <div className="icon">
                <Image
                  src="/img/assista-x.svg"
                  alt="JS"
                  width={40}
                  height={40}
                />
              </div>              
              <div className="icon">
                <Image src="/img/pycharm.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image
                  src="/img/assista-performance.svg"
                  alt="JS"
                  width={40}
                  height={40}
                />
              </div>
              <div className="icon">
                <Image
                  src="/img/assista-wiki.svg"
                  alt="JS"
                  width={40}
                  height={40}
                />
              </div>
              <div className="icon">
                <Image
                  src="/img/assista-news.svg"
                  alt="JS"
                  width={40}
                  height={40}
                />
              </div>
              <div className="icon">
                <Image
                  src="img/easy-instance-new.svg"
                  alt="JS"
                  width={40}
                  height={40}
                />
              </div>

              <div className="icon">
                <Image src="/img/vscode.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image
                  src="/img/assista-builder.svg"
                  alt="JS"
                  width={40}
                  height={40}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
