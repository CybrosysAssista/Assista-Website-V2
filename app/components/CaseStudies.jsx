"use client";

import Image from "next/image";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";

// Testimonial data
const testimonials = [
  {
    id: 1,
    name: "Arun Kumar",
    position: "CEO, Horillan Technologies",
    content:
      "Lorem ipsum dolor sit amet consecteturalias laudantium voluptates sum dolor sit amet consectetur adipisicing elit.",
    avatar: "/img/user1.png",
  },
  {
    id: 2,
    name: "Sarah Johnson",
    position: "CTO, TechCorp Solutions",
    content:
      "The platform has revolutionized our workflow. Our team productivity has increased by 40% since implementation.",
    avatar: "/img/user2.png",
  },
  {
    id: 3,
    name: "Michael Chen",
    position: "Founder, InnovateLab",
    content:
      "Outstanding service and support. The team went above and beyond to ensure our success. Highly recommended for any growing business.",
    avatar: "/img/user3.png",
  },
  {
    id: 4,
    name: "Emily Rodriguez",
    position: "VP Operations, GlobalTech",
    content:
      "The integration was seamless and the results exceeded our expectations. Our customer satisfaction scores have improved significantly.",
    avatar: "/img/user1.png",
  },
  {
    id: 5,
    name: "David Thompson",
    position: "Director, FutureSystems",
    content:
      "Exceptional quality and reliability. The platform has become an integral part of our daily operations and has streamlined our processes.",
    avatar: "/img/user2.png",
  },
];

function CaseStudies() {
  return (
    <div className="pb-20 pt-10">
      <div className="cmpad">
        <div className="trust-container flex-col relative  text-center p-20 bg-[#1e75d11c] rounded-2xl">
          <Image
            src="/img/qoute.svg"
            alt="qoute"
            width={300}
            height={300}
            className="absolute -right-10 -top-10 opacity-70 z-10"
          />

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

          <div className="trust-text">
            <div className="trust-number">Trusted by 20k+</div>
            <div className="trust-description">Customers Across the Globe</div>
          </div>

          <div className="relative flex flex-col justify-between items-center">
            <div className="swiper-container w-full">
              <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                autoplay={{
                  delay: 5000,
                  disableOnInteraction: false,
                }}
                loop={true}
                className="testimonial-swiper"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <div className="testimonial-slide flex flex-col justify-center items-center text-center">
                      <p className="max-w-[60%] m-auto text-lg text-[#7e7e7e] mb-6">
                        {testimonial.content}
                      </p>

                      <div className="text-center">
                        <h5 className="text-lg font-medium text-[#1a1a1a]">
                          {testimonial.name}
                        </h5>
                        <p className="text-[#7e7e7e] text-sm">
                          {testimonial.position}
                        </p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Buttons */}
              <div className="swiper-button-prev !text-[var(--primary-color)] !w-12 !h-12 !mt-0 !top-1/2 !left-4 !transform !-translate-y-1/2 !bg-white !rounded-full !shadow-lg hover:!bg-[var(--primary-color)] hover:!text-white transition-all duration-300"></div>
              <div className="swiper-button-next !text-[var(--primary-color)] !w-12 !h-12 !mt-0 !top-1/2 !right-4 !transform !-translate-y-1/2 !bg-white !rounded-full !shadow-lg hover:!bg-[var(--primary-color)] hover:!text-white transition-all duration-300"></div>
            </div>
          </div>

          <a
            href=""
            className="mt-8 flex justify-center items-center px-8 py-3 bg-[var(--primary-color)] text-white rounded-md hover:bg-[#ce797e] transition duration-300 mx-auto w-fit"
          >
            View all Case Studies
          </a>
        </div>
      </div>
    </div>
  );
}

export default CaseStudies;
