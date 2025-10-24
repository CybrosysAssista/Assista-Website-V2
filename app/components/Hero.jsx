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
                <span className="bg-gradient-to-r from-[#e97d83] to-[#e19bff] bg-clip-text text-transparent relative">
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
                  className="flex justify-center items-center w-45 py-3 bg-[var(--primary-color)] text-white rounded-md hover:bg-[#ce797e] transition duration-300"
                >
                  Get Started
                </a>
                <a
                  href=""
                  className="text-center w-45 py-3 text-[#ee767c] bg-[#e97d8228] border-[#e97d8225] border-2 rounded-md hover:bg-[#ce797e] hover:border-[#ce797e] hover:text-white transition duration-300"
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
                    Customers Across the Globe
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="icon">
                <Image src="/img/logo1.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo2.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo3.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo2.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo5.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo8.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo7.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo8.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo9.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo1.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo5.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo3.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo13.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo14.svg" alt="JS" width={40} height={40} />
              </div>
              <div className="icon">
                <Image src="/img/logo1.svg" alt="JS" width={40} height={40} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
