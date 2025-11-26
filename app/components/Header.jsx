"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";

function Header() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";
  const isLoadingSession = status === "loading";

  const [isActive, setIsActive] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobileResourcesOpen, setIsMobileResourcesOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

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
  const handleCallToAction = async () => {
    if (isLoadingSession || isProcessing) return;

    setIsProcessing(true);
    try {
      if (isAuthenticated) {
        await router.push("/dashboard");
      } else {
        await signIn(undefined, { callbackUrl: "/signin" });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    try {
      await signOut({ callbackUrl: "/signin" });
    } finally {
      setIsSigningOut(false);
    }
  };

  const renderCallToActionIcon = () => {
    if (isProcessing) {
      return (
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="9" className="opacity-25" />
          <path d="M12 3a9 9 0 0 1 9 9" className="opacity-75" />
        </svg>
      );
    }

    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M1 11c5.523 0 10-4.477 10-10h2c0 5.523 4.477 10 10 10v2c-5.523 0-10 4.477-10 10h-2c0-5.523-4.477-10-10-10z"
        />
      </svg>
    );
  };

  return (
    <header className="fixed  top-0 left-0 w-full z-50 transition-all ">
      <div className="cmpad">
        <div className="bg-white border border-[#9e9e9e26] ps-8 pe-4 rounded-full [box-shadow:0px_0px_20px_rgb(0_0_0_/_8%)] mt-3">
          <div
            className={`flex gap-6 justify-between items-center transition-all duration-300 ${
              isActive ? "h-18 mt-0" : "h-21"
            }`}
          >
            {/* <a
              href="/"
              className="text-[30px] font-bold text-[#212121] font-logo"
            >
              Cybrosys Assista
            </a> */}

            <Link href="/">
              <Image
                src="/logo/logo7.svg"
                alt="Cybrosys Assista"
                width={280}
                height={280}
                className="w-[230px] md:w-[280px] h-auto"
              />
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex flex-1 items-center justify-end gap-15">
              <ul className="flex items-center space-x-6 xl:space-x-10 text-[15px]">
                <li>
                  <a
                    href="/about"
                    className="w-max flex transition duration-300 ease-in-out hover:text-[var(--primary-color)]"
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
                    className={`dropdown absolute max-w-[1425px] rounded-md z-50 ${
                      isActive ? "top-[85px]" : "top-[98px]"
                    } min-h-[400px] right-0 left-0 m-auto w-full bg-white shadow-lg opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50`}
                    role="menu"
                    aria-label="Resources submenu"
                  >
                    <div className=" grid grid-cols-4 gap-13 p-3 cmpad pt-10">
                      <a
                        href="/assista-ide"
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
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
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/easy-instance-new.svg"
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
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/assista-x.svg"
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
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/assista-performance.svg"
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
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/assista-wiki.svg"
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
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/assista-news.svg"
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
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/assista-air.svg"
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
                        href="assista-builder"
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/assista-builder.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Assista Bulider</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Browser Extensions Store
                          </p>
                        </div>
                      </a>
                      <a
                        href="/helper-for-vs-code"
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/vscode.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Helper for VS Code</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Odoo Helper for VS Code
                          </p>
                        </div>
                      </a>
                      <a
                        href="/helper-for-pycharm"
                        className="submenu flex items-center gap-3 text-sm text-[#333]"
                        role="menuitem"
                      >
                        <Image
                          src="/img/pycharm.svg"
                          alt=""
                          width={40}
                          height={40}
                        />
                        <div>
                          <h5 className="font-semibold">Helper for Pycharm</h5>
                          <p className="text-sm text-[#7e7e7e]">
                            Odoo Helper for Pycharm
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
                    href="/faq"
                    className="transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    FAQ
                  </a>
                </li>
                {isAuthenticated && (
                  <li>
                    <Link
                      href="/dashboard"
                      className="transition duration-300 ease-in-out hover:text-[var(--primary-color)]"
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                <li>
                  <a
                    href="/contact"
                    className="w-max flex transition duration-300 ease-in-out hover:text-[var(--primary-color)] t"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
              <button
                type="button"
                onClick={handleCallToAction}
                className="w-max px-6 py-3 bg-[var(--primary-color)] text-white rounded-full flex gap-2 items-center hover:bg-[#666] transition duration-300 disabled:opacity-70"
                disabled={isProcessing || isLoadingSession}
              >
                {renderCallToActionIcon()}
                {isAuthenticated ? "Open Dashboard" : "Try Assista"}
              </button>
              {isAuthenticated && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-max px-6 py-3 border border-slate-300 text-slate-700 rounded-full flex gap-2 items-center hover:bg-slate-100 transition duration-300 disabled:opacity-70"
                  disabled={isSigningOut}
                >
                  {isSigningOut ? (
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="9" className="opacity-25" />
                      <path d="M12 3a9 9 0 0 1 9 9" className="opacity-75" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M16 13v-2H7V8l-5 4l5 4v-3zm3-11H9v2h10v16H9v2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2"
                      />
                    </svg>
                  )}
                  Sign out
                </button>
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              aria-label="Toggle menu"
              aria-expanded={isMobileOpen}
              className="cursor-pointer lg:hidden text-[var(--primary-color)] inline-flex items-center justify-center w-10 h-10 rounded-full border border-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white transition duration-300"
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
        </div>
        {/* Mobile menu panel with animation */}
        <div
          className={`lg:hidden overflow-hidden overflow-y-auto bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 ${
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
                <button
                  type="button"
                  aria-expanded={isMobileResourcesOpen}
                  aria-controls="mobile-resources"
                  onClick={() => setIsMobileResourcesOpen((v) => !v)}
                  className="w-full flex justify-between items-center py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                >
                  <span>Our Resources</span>
                  <svg
                    className={`w-4 h-4 transform transition-transform duration-200 ${
                      isMobileResourcesOpen ? "rotate-180" : "rotate-0"
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M5.23 7.21a.75.75 0 011.06-.02L10 10.88l3.71-3.69a.75.75 0 111.06 1.06l-4.24 4.22a.75.75 0 01-1.06 0L5.25 8.25a.75.75 0 01-.02-1.04z" />
                  </svg>
                </button>
                
                <div
                  id="mobile-resources"
                  className={`overflow-hidden transition-[max-height] duration-300 ${
                    isMobileResourcesOpen ? "max-h-96 mt-2" : "max-h-0"
                  }`}
                >
                  <ul className="pl-3 space-y-2">
                    <li>
                      <a
                        href="/assista-ide"
                        className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                      >
                        Assista IDE
                      </a>
                    </li>
                    <li>
                      <a
                        href="/easy-instance"
                        className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                      >
                        Easy Instance
                      </a>
                    </li>
                    <li>
                      <a
                        href="/assista-x"
                        className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                      >
                        Assista X
                      </a>
                    </li>
                    <li>
                      <a
                        href="/assista-performance"
                        className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                      >
                        Assista Performance
                      </a>
                    </li>
                    <li>
                      <a
                        href="/assista-wiki"
                        className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                      >
                        Assista Wiki
                      </a>
                    </li>
                    <li>
                      <a
                        href="/assista-news"
                        className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                      >
                        Assista News
                      </a>
                    </li>
                    <li>
                      <a
                        href="/assista-air"
                        className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                      >
                        Assista Air
                      </a>
                    </li>
                    <li>
                      <a
                        href="/assista-builder"
                        className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                      >
                        Assista Builder
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li>
                <a
                  href="/"
                  className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                >
                  Docs
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                >
                  FAQ
                </a>
              </li>
              {isAuthenticated && (
                <li>
                  <Link
                    href="/dashboard"
                    className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                  >
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <a
                  href="/contact"
                  className="block py-2 px-2 rounded-lg hover:text-[var(--primary-color)]"
                >
                  Contact Us
                </a>
              </li>
            </ul>
            <button
              type="button"
              onClick={handleCallToAction}
              className="cursor-pointer mt-4 w-full gap-3 inline-flex justify-center px-6 py-3 bg-[var(--primary-color)] text-white rounded-full items-center hover:bg-[#666] transition duration-300 disabled:opacity-70"
              disabled={isProcessing || isLoadingSession}
            >
              {renderCallToActionIcon()}
              {isAuthenticated ? "Open Dashboard" : "Try Assista"}
            </button>
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSignOut}
                className="mt-3 w-full gap-3 inline-flex justify-center px-6 py-3 border border-slate-300 text-slate-700 rounded-full items-center hover:bg-slate-100 transition duration-300 disabled:opacity-70"
                disabled={isSigningOut}
              >
                {isSigningOut ? (
                  <svg
                    className="h-4 w-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="9" className="opacity-25" />
                    <path d="M12 3a9 9 0 0 1 9 9" className="opacity-75" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M16 13v-2H7V8l-5 4l5 4v-3zm3-11H9v2h10v16H9v2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2"
                    />
                  </svg>
                )}
                Sign out
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
