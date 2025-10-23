import Image from "next/image";
import React from "react";

function TwoBox() {
  return (
    <div className="py-20">
      <div className="cmpad">
        <div style={{ textAlign: "center" }}>
          <span className="badge">Our Main Benefits</span>
        </div>

        <h2 className="mainhead relative w-max m-auto">
          <Image
            src="/img/arrow1.svg"
            alt=""
            width={100}
            height={100}
            className="absolute -left-30 -top-6"
          />
          Collect prospects from{" "}
          <span className="bg-gradient-to-r from-[#e97d83] to-[#e19bff] bg-clip-text text-transparent relative">
            all touchpoints
          </span>
        </h2>

        <p className="leading-7 text-[#7e7e7e] text-center max-w-[700px] mx-auto mb-15">
          Import lead lists in one click, distribute leads instantly, and track
          interactions in social conversation inlets all from a single platform.
        </p>

        <div className="cards-container feature">
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
        </div>
      </div>
    </div>
  );
}

export default TwoBox;
