import Image from "next/image";
import React from "react";

function Video() {
  return (
    <div className="py-10 md:py-20">
      <div className="cmpad">
        <div style={{ textAlign: "center" }}>
          <span className="badge">Take a Tour</span>
        </div>

        <h2 className="mainhead relative w-max m-auto">
          <Image
            src="/img/arrow1.svg"
            alt=""
            width={100}
            height={100}
            className="absolute -left-30 -top-6"
          />
          Discover the <span className="underlineimg">Power of Assista</span>
        </h2>

        <p className="leading-7 text-[#7e7e7e] text-center max-w-[750px] mx-auto mb-15 text-lg">
          Watch how Assista streamlines workflows, automates repetitive tasks,
          and boosts Odoo performance all in one smooth experience.
        </p>

        <video
          src="/img/video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-[1200px] m-auto h-auto object-cover rounded-xl"
        ></video>

        {/* <div className="cards-container feature">
          <div className="card">
            <h2>Built for Every Business</h2>
            <ul className="feature-list">
              <li className="feature-item">
                <span className="checkmark"></span>
                <span>AI-powered business automation</span>
              </li>
              <li className="feature-item">
                <span className="checkmark"></span>
                <span>Smart customer relationship tools</span>
              </li>
              <li className="feature-item">
                <span className="checkmark"></span>
                <span>Seamless project management</span>
              </li>
              <li className="feature-item">
                <span className="checkmark"></span>
                <span>Integrated reporting & analytics</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2>Industries we serve</h2>
            <ul className="feature-list">
              <li className="feature-item">
                <span className="checkmark"></span>
                <span>Pay-per-click (PPC) Ads</span>
              </li>
              <li className="feature-item">
                <span className="checkmark"></span>
                <span>Chatbots &live chats</span>
              </li>
              <li className="feature-item">
                <span className="checkmark"></span>
                <span>Online portals & marketplaces</span>
              </li>
              <li className="feature-item">
                <span className="checkmark"></span>
                <span>Social media</span>
              </li>
            </ul>
          </div>
        </div> */}
      </div>
    </div>
  );
}

export default Video;
