"use client";
import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";

function Header() {
  const [isActive, setIsActive] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= 10) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <header className="fixed  top-0 left-0 w-full z-50 transition-all ">
      <div className="cmpad">
        <div className="bg-white border ps-8 pe-4 rounded-full border-[#e97d8326] [box-shadow:0px_5px_20px_rgb(0_0_0_/_3%)] mt-3">
          <div
            className={`flex gap-6 justify-between items-center transition-all duration-300 ${
              isActive ? "h-18 mt-0" : "h-21"
            }`}
          >
            <a href="/" className="text-4xl font-bold text-[#212121] font-logo">
              Cybrosys Assista
            </a>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex flex-1 items-center justify-end gap-15">
              <ul className="flex items-center space-x-10 text-[15px]">
                <li>
                  <a
                    href=""
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)]"
                  ></a>
                </li>
                <li>
                  <a
                    href=""
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)]"
                  >
                    About Us
                  </a>
                </li>
                <li className=" group hover:text-[var(--primary-color)] h-21 flex items-center">
                  <a
                    href="#"
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] inline-flex items-center gap-2"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Resources
                    <svg
                      className="w-5 h-5 transition-transform duration-200 group-hover:rotate-180"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M5.23 7.21a.75.75 0 011.06-.02L10 10.88l3.71-3.69a.75.75 0 111.06 1.06l-4.24 4.22a.75.75 0 01-1.06 0L5.25 8.25a.75.75 0 01-.02-1.04z" />
                    </svg>
                  </a>

                  {/* Hoverable dropdown (desktop) */}
                  <div
                    className={`dropdown absolute ${
                      isActive ? "top-[73px]" : "top-[85px]"
                    } min-h-[400px] right-0 left-0 m-auto w-full bg-white shadow-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50`}
                    role="menu"
                    aria-label="Resources submenu"
                  >
                    <div className="grid grid-cols-4 gap-13 p-3 cmpad pt-10">
                      <a
                        href="/assista-ide"
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/icon1.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista IDE</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            IDE for Odoo Developers
                          </p>
                        </div>
                      </a>
                      <a
                        href="easy-instance"
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo1.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Easy Instance</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Deploying Odoo Instances
                          </p>
                        </div>
                      </a>
                      <a
                        href="assista-x"
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo3.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista X</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Talk with Odoo assistant
                          </p>
                        </div>
                      </a>
                      <a
                        href="assista-performance"
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo5.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista Performance</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Monitor the Odoo Instance
                          </p>
                        </div>
                      </a>
                      <a
                        href="assista-wiki"
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo7.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista Wiki</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Generate Repo Documentation
                          </p>
                        </div>
                      </a>
                      <a
                        href="assista-news"
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo8.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista News</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Know the latest News of AI
                          </p>
                        </div>
                      </a>
                      <a
                        href="assista-air"
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo9.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista Air</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Browser Extensions Store
                          </p>
                        </div>
                      </a>
                      <a
                        href=""
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo7.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista Wiki</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Generate Repo Documentation
                          </p>
                        </div>
                      </a>
                      <a
                        href=""
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo1.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Easy Instance</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Deploying Odoo Instances
                          </p>
                        </div>
                      </a>
                      <a
                        href=""
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo3.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista X</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Talk with Odoo assistant
                          </p>
                        </div>
                      </a>
                      <a
                        href=""
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo8.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista News</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Know the latest News of AI
                          </p>
                        </div>
                      </a>
                      <a
                        href=""
                        className="flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/logo9.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista Air</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Browser Extensions Store
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>
                </li>
                <li>
                  <a
                    href=""
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    Docs
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    FAQ
                  </a>
                </li>
                <li>
                  <a
                    href=""
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
              <a
                href="/login"
                className="px-6 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#aa6e71] transition duration-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M1 11c5.523 0 10-4.477 10-10h2c0 5.523 4.477 10 10 10v2c-5.523 0-10 4.477-10 10h-2c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                Try Assista
              </a>
            </nav>

            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              className="lg:hidden text-[var(--primary-color)] inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition duration-300"
              onClick={() => setIsMobileOpen((v) => !v)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
          {/* Mobile menu panel with animation */}
          <div
            className={`lg:hidden bg-white rounded-2xl overflow-hidden transform transition-all duration-300 ${
              isMobileOpen
                ? "mt-2 opacity-100 translate-y-0 max-h-[420px]"
                : "mt-0 opacity-0 -translate-y-2 max-h-0 pointer-events-none"
            }`}
          >
            <div className="p-4">
              <ul className="space-y-3 text-[15px] text-left">
                <li>
                  <a
                    href="/about"
                    className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="/services"
                    className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                  >
                    Our Services
                  </a>
                </li>
                <li>
                  <a
                    href="/features"
                    className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="/blogs"
                    className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                  >
                    Blogs
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
              <a
                href="#"
                className="mt-4 w-full inline-flex justify-center px-6 py-3 bg-[var(--primary-color)] text-white rounded-full items-center hover:bg-[#454685] transition duration-300"
              >
                Let’s Go
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
