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
              Get in Touch{" "}
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
              Our team is here to help you explore how Assista can enhance your
              business with smart automation and AI-powered solutions.
            </p>

            <nav className="breadcrumb justify-center mt-5 text-sm sm:text-base">
              <a href="#">Home</a>
              <span>›</span>
              <span className="active">Contact Us</span>
            </nav>
          </div>

          <div className="p-4 sm:p-6 md:p-10 mb-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
              {/* Left Column - Contact Info */}
              <div className="lg:col-span-6 flex flex-col justify-center">
                <h2 className="text-4xl mb-6 relative leading-normal">
                  Connect with <span className="underlineimg">Our Team</span>
                </h2>

                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <div className="text-[#d75869]">
                      {/* Location Icon */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2a9 9 0 0 1 9 9c0 3.074-1.676 5.59-3.442 7.395a20.4 20.4 0 0 1-2.876 2.416l-.426.29l-.2.133l-.377.24l-.336.205l-.416.242a1.87 1.87 0 0 1-1.854 0l-.416-.242l-.52-.32l-.192-.125l-.41-.273a20.6 20.6 0 0 1-3.093-2.566C4.676 16.589 3 14.074 3 11a9 9 0 0 1 9-9m0 6a3 3 0 1 0 0 6a3 3 0 0 0 0-6" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-lg">
                        Address
                      </div>
                      <div className="text-[#58586b] text-md">
                        Neospace, Kinfra Techno Park <br />
                        Kakkancherry <br />
                        Calicut University P.O. <br />
                        Kerala, India - 673635
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-3">
                    <div className="text-[#d75869]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.28-.28.67-.36 1.02-.25c1.12.37 2.32.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Phone</div>
                      <a
                        href="tel:+918606827707"
                        className="text-[#58586b] text-md hover:underline text-lg"
                      >
                        +91 8606827707
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-3">
                    <div className="text-[#d75869]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M4 20q-.825 0-1.412-.587T2 18V6q0-.825.588-1.412T4 4h16q.825 0 1.413.588T22 6v12q0 .825-.587 1.413T20 20zm8-7l8-5V6l-8 5l-8-5v2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium text-gray-800">Email</div>
                      <a
                        href="mailto:info@easyinstance.com"
                        className="text-[#58586b] text-md hover:underline text-lg"
                      >
                        info@easyinstance.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Contact Form */}
              <div className="lg:col-span-6 flex flex-col justify-center mt-8 lg:mt-0"> 
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    className="border-2 border-[#ececec] px-3 py-2 text-[#58586b] rounded-lg outline-0 w-full"
                    placeholder="Enter your name"
                  />
                  <input
                    type="text"
                    className="border-2 border-[#ececec] px-3 py-2 text-[#58586b] rounded-lg outline-0 w-full"
                    placeholder="Enter your email"
                  />
                  <input
                    type="text"
                    className="border-2 border-[#ececec] px-3 py-2 text-[#58586b] rounded-lg outline-0 w-full md:col-span-2"
                    placeholder="Enter your phone"
                  />
                  <textarea
                    className="border-2 border-[#ececec] px-3 py-2 text-[#58586b] rounded-lg outline-0 w-full md:col-span-2"
                    rows="4"
                    placeholder="Enter your message"
                  ></textarea>
                </div>
                <button className="w-max cursor-pointer px-6 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#666] transition duration-300">
                  Submit
                </button>
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
