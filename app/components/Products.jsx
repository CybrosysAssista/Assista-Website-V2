import Image from "next/image";
import React from "react";

function Products() {
  const products = [
    {
      title: "Assista IDE",
      description: "IDE for Odoo Developers",
      icon: "/img/logo1.svg",
    },
    {
      title: "Easy Instance",
      description: "Platform for deploying Odoo Instances",
      icon: "/img/logo2.svg",
    },
    {
      title: "Assista X",
      description: "Talk with your Odoo Like an assistant",
      icon: "/img/logo3.svg",
    },
    {
      title: "Assista Performance",
      description: "Monitor and Analyse Performance of your Odoo Instance",
      icon: "/img/logo5.svg",
    },
    {
      title: "Assista Wiki",
      description: "Generate and Print Public Github Repository Documentation",
      icon: "/img/logo7.svg",
    },
    {
      title: "Assista News",
      description: "Know the latest News and Tools from AI World",
      icon: "/img/logo8.svg",
    },
    {
      title: "Assista Air",
      description: "Browser Extensions Store",
      icon: "/img/logo9.svg",
    },
  ];
  return (
    <div className="py-20">
      <div className="cmpad">
        <div style={{ textAlign: "center" }}>
          <span className="badge">All Products</span>
        </div>

        <h2 className="mainhead relative w-max m-auto">
          <Image
            src="/img/arrow1.svg"
            alt=""
            width={100}
            height={100}
            className="absolute -left-30 -top-6"
          />
          Manage with{" "}
          <span className="bg-gradient-to-r from-[#e97d83] to-[#e19bff] bg-clip-text text-transparent relative">
            powerful solutions
          </span>
        </h2>

        <p className="leading-7 text-[#7e7e7e] text-center max-w-[700px] mx-auto mb-20">
          From marketing to sales support and analytics our products help you
          streamline every part of your business and grow efficiently.
        </p>

        <div className="products">
          {products.map((product, index) => (
            <div className="pro-row" key={product.title}>
              <div className="card group hover:scale-101 transition-all duration-300">
                <div className="card-content">
                  <div className="icon">
                    <Image
                      src={product.icon || "/img/logo1.svg"}
                      alt=""
                      width={60}
                      height={60}
                    />
                  </div>
                  <div className="info">
                    <h3 className="text-lg font-semibold mb-2">
                      {product.title}
                    </h3>
                    <p className="text-gray-600">{product.description}</p>
                  </div>
                </div>
                <div className="arrow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      fillRule="evenodd"
                      d="M106.68 277.328h216.973l-70.25 70.25l30.167 30.167l121.75-121.75l-121.75-121.74l-30.167 30.167l70.247 70.239H106.68z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Products;
