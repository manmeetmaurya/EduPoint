import React, { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation, Autoplay } from "swiper"
import "swiper/css"
import "swiper/css/navigation"
import { FaStar } from "react-icons/fa"

import { apiConnector } from "../../services/apiConnector"
import { ratingsEndpoints } from "../../services/apis"

function ReviewSlider() {
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        )
        if (data?.success) {
          setReviews(data?.data)

          // calculate average rating
          const ratings = data.data.map((r) => r.rating)
          const avg =
            ratings.reduce((sum, r) => sum + r, 0) / (ratings.length || 1)
          setAverageRating(avg.toFixed(1))
        }
      } catch (err) {
        console.error("Error fetching reviews:", err)
      }
    })()
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto my-12 px-4">
      {/* ---------- Header Section ---------- */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            What Our Customers Say
          </h2>
          <div className="flex items-center gap-2 mt-3">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(averageRating)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                />
              ))}
            <span className="text-gray-600 font-medium ml-2">
              {averageRating} rating from {reviews.length} reviews
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Swiper Section ---------- */}
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          320: { slidesPerView: 1, spaceBetween: 20 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
      >
        {reviews.map((review, i) => (
          <SwiperSlide key={i}>
            <div className="bg-brown-100 rounded-xl p-6 shadow-lg h-full flex flex-col">
              {/* User Info */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    review?.user?.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                  }
                  alt={`${review?.user?.firstName} ${review?.user?.lastName}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-semibold text-black text-lg">
                    {review?.user?.firstName} {review?.user?.lastName}
                  </h3>

                </div>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-semibold text-yellow-600">
                  {review?.rating?.toFixed(1)}
                </span>
                {Array.from({ length: 5 }).map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={
                      idx < Math.round(review?.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
              </div>

              {/* Course Info */}
              {review?.course?.courseName && (
                <p className="text-sm font-medium text-black mb-3">
                  {review.course.courseName}
                </p>
              )}

              {/* Review Text */}
              <p className="text-black text-sm leading-relaxed flex-1">
                {review?.review}
              </p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

export default ReviewSlider
