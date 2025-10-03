import { memo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

// Import images local
import banner1 from "../../../../assets/users/images/banner/banner-1.png";
import banner2 from "../../../../assets/users/images/banner/banner-2.png";
import banner3 from "../../../../assets/users/images/banner/banner-3.png";
import banner4 from "../../../../assets/users/images/banner/banner-4.png";
import banner5 from "../../../../assets/users/images/banner/banner-5.png";
import banner_Right1 from "../../../../assets/users/images/banner/banner-right-1.png";
import banner_Right2 from "../../../../assets/users/images/banner/banner-right-2.png";
const leftBanners = [
  { id: 1, img: banner1, alt: "iPhone khuyến mãi" },
  { id: 2, img: banner2, alt: "Samsung khuyến mãi" },
  { id: 3, img: banner3, alt: "Oppo khuyến mãi" },
  { id: 4, img: banner4, alt: "Vivo khuyến mãi" },
  { id: 5, img: banner5, alt: "Xiaomi khuyến mãi" },
];

const rightBanners = [
  { id: 1, img: banner_Right1, alt: "Oppo khuyến mãi" },
  { id: 2, img: banner_Right2, alt: "Samsung khuyến mãi" }
];


const Banner = () => {
  return (
    <>
    <section className="w-full px-[15px] my-6 sm:my-8 lg:my-10">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
        {/* Left Banner (Carousel) */}
        <div className="lg:col-span-7 aspect-[4/1]">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            loop
            className="w-full h-full rounded-lg overflow-hidden"
          >
            {leftBanners.map((item) => (
              <SwiperSlide key={item.id}>
                <a href="/promotion">
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </a>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/*  Right Banner */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {rightBanners.map((item) => (
            <a
              key={item.id}
              href="/promotion"
              className="flex-1 aspect-[4/1] block"
            >
              <img
                src={item.img}
                alt={item.alt}
                className="w-full h-full object-cover rounded-lg"
              />
            </a>
          ))}
        </div>
      </div>
      
    </section>
    </>
  );
};

export default memo(Banner);