import { Carousel } from "@material-tailwind/react";
import { ArrowRightIcon } from "../../icons/ArrowRightIcon";
import { ArrowLeftIcon } from "../../icons/ArrowLeftIcon";

export const ImageSlider = ({ images }) => {
  return (
    <Carousel
      className="rounded-xl shadow-md bg-gray-600"
      navigation={({ setActiveIndex, activeIndex, length }) => (
        <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
          {new Array(length).fill("").map((_, i) => (
            <span
              key={i}
              className={`block h-1 cursor-pointer rounded-2xl transition-all content-[''] ${
                activeIndex === i ? "w-8 bg-white" : "w-4 bg-white/50"
              }`}
              onClick={() => setActiveIndex(i)}
            />
          ))}
        </div>
      )}
      prevArrow={({ handlePrev }) => (
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full border border-gray-100"
        >
          <ArrowLeftIcon />
        </button>
      )}
      nextArrow={({ handleNext }) => (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white bg-black bg-opacity-50 rounded-full border border-gray-100"
        >
          <ArrowRightIcon />
        </button>
      )}
    >
      {images ? (
        images.map((item, index) => (
          <img
            className="w-full h-96 object-cover object-center"
            key={index}
            src={item}
            alt={`${index}`}
          />
        ))
      ) : (
        <p>Imagen no disponible</p>
      )}
    </Carousel>
  );
};
