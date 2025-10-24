import Image from "next/image";
import React from "react";

function Feature() {
  return (
    <div className="py-20">
      <div className="cmpad">
        <div style={{ textAlign: "center" }}>
          <span className="badge">Key Features</span>
        </div>

        <h2 className="mainhead relative w-max m-auto">
          <Image
            src="/img/arrow2.svg"
            alt=""
            width={100}
            height={100}
            className="absolute -right-30 -top-6"
          />
          Grow business with{" "}
          <span className="bg-gradient-to-r from-[#e97d83] to-[#e19bff] bg-clip-text text-transparent relative">
            automation tools
          </span>
        </h2>

        <p className="leading-7 text-[#7e7e7e] text-center max-w-[700px] mx-auto mb-15">
          Simplify your workflows, boost productivity, and manage every process
          with ease all from one intuitive dashboard built to scale with your
          business.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[90%] mx-auto">
          <div>
            <Image
              src="/img/abt3.png"
              alt=""
              width={600}
              height={600}
              className="m-auto"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-medium mb-3 leading-13">
              Streamline your <br /> Wrok with smart features
            </h2>

            <p className="leading-7 text-[#7e7e7e] max-w-[700px] mx-auto mb-8 text-lg">
              Automate repetitive tasks connect your favorite apps, and gain
              real-time insights to make smarter decisions helping your team
              work faster and more efficiently.
            </p>
            <a
              href=""
              className="flex justify-center items-center w-45 py-3 bg-[var(--primary-color)] text-white rounded-md hover:bg-[#ce797e] transition duration-300"
            >
              Read More
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 py-30 max-w-[90%] mx-auto">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-medium mb-3 leading-13">
              Empower your <br /> Development with Assista
            </h2>

            <p className="leading-7 text-[#7e7e7e] max-w-[700px] mx-auto mb-8 text-lg">
              Code smarter with built-in Odoo support, intelligent suggestions,
              and seamless integrations that simplify your workflow and boost
              productivity at every step.
            </p>
            <a
              href=""
              className="flex justify-center items-center w-45 py-3 bg-[var(--primary-color)] text-white rounded-md hover:bg-[#ce797e] transition duration-300"
            >
              Read More
            </a>
          </div>
          <div>
            <Image
              src="/img/abt3.png"
              alt=""
              width={600}
              height={600}
              className="m-auto"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-[90%] mx-auto">
          <div>
            <Image
              src="/img/abt3.png"
              alt=""
              width={600}
              height={600}
              className="m-auto"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-medium mb-3 leading-13">
              Accelerate your <br /> Odoo Projects with Ease
            </h2>

            <p className="leading-7 text-[#7e7e7e] max-w-[700px] mx-auto mb-8 text-lg">
              Streamline module creation, manage instances effortlessly, and
              collaborate in real time — all within a unified platform designed
              for Odoo professionals.
            </p>

            <a
              href=""
              className="flex justify-center items-center w-45 py-3 bg-[var(--primary-color)] text-white rounded-md hover:bg-[#ce797e] transition duration-300"
            >
              Read More
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Feature;
