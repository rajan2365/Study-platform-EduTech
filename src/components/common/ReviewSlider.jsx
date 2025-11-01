
import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";

// Icons
import { FaStar } from "react-icons/fa";
// Import required modules
import { Autoplay, FreeMode, Pagination } from "swiper/modules";

// Get apiFunction and the endpoint
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      const { data } = await apiConnector(
        "GET",
        ratingsEndpoints.REVIEWS_DETAILS_API
      );
      if (data?.success) {
        setReviews(data?.data);
      }
    })();
  }, []);

  return (
    <div className="text-white my-[50px] max-w-maxContentTab lg:max-w-maxContent mx-auto">
      <Swiper
        slidesPerView={1}
        spaceBetween={20}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        loop={true}
        freeMode={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        modules={[FreeMode, Pagination, Autoplay]}
        className="w-full"
      >
        {reviews.map((review, i) => (
          <SwiperSlide key={i}>
            <div className="flex flex-col gap-3 rounded-lg bg-richblack-800 p-4 shadow-lg hover:shadow-xl transition-shadow duration-300 text-[14px] text-richblack-25">
              <div className="flex items-center gap-4 m-auto">
                <img
                  src={
                    review?.user?.image
                      ? review?.user?.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName ?? ""} ${review?.user?.lastName ?? ""}`
                  }
                  alt={review?.user?.firstName ?? "User"}
                  className="h-10 w-10 rounded-full object-cover border-2 border-yellow-100"
                />
                <div className="flex flex-col">
                  <h1 className="font-semibold text-richblack-5 text-sm md:text-base">
                    {`${review?.user?.firstName ?? ""} ${review?.user?.lastName ?? ""}`}
                  </h1>
                  <h2 className="text-[12px] font-medium text-richblack-500">
                    {review?.course?.courseName ?? ""}
                  </h2>
                </div>
              </div>
              <p className="font-medium text-richblack-25 text-sm md:text-[14px]">
                {review?.review?.split(" ").length > truncateWords
                  ? `${review?.review
                      .split(" ")
                      .slice(0, truncateWords)
                      .join(" ")} ...`
                  : review?.review ?? ""}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <h3 className="font-semibold text-yellow-100 text-sm md:text-base">
                  {review?.rating?.toFixed(1) ?? "0.0"}
                </h3>
                <ReactStars
                  count={5}
                  value={review?.rating ?? 0}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ReviewSlider;
