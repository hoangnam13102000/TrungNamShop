import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

import banner1 from "@banner/banner-1.png";
import banner2 from "@banner/banner-2.png";
import banner3 from "@banner/banner-3.png";
import banner4 from "@banner/banner-4.png";
import banner5 from "@banner/banner-5.png";
import bannerRight1 from "@banner/banner-right-1.png";
import bannerRight2 from "@banner/banner-right-2.png";

const LEFT_BANNERS = [
  { id: 1, img: banner1, alt: "iPhone khuyến mãi" },
  { id: 2, img: banner2, alt: "Samsung khuyến mãi" },
  { id: 3, img: banner3, alt: "Oppo khuyến mãi" },
  { id: 4, img: banner4, alt: "Vivo khuyến mãi" },
  { id: 5, img: banner5, alt: "Xiaomi khuyến mãi" },
];

const RIGHT_BANNERS = [
  { id: 1, img: bannerRight1, alt: "Oppo khuyến mãi" },
  { id: 2, img: bannerRight2, alt: "Samsung khuyến mãi" },
];

export default function HomeBanner() {
  return (
    <section className="w-full px-4 my-10">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-4">
          {/* Left Banner (Carousel) */}
          <div className="lg:col-span-7 aspect-[4/1]">
            <Swiper
              modules={[Autoplay]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              loop
              className="w-full h-full rounded-lg overflow-hidden"
            >
              {LEFT_BANNERS.map((item) => (
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

          {/* Right Banner */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {RIGHT_BANNERS.map((item) => (
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
      </div>
    </section>
  );
}
