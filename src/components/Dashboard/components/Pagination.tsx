import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}: PaginationProps) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="relative h-[120px] sm:h-[130px] md:h-[140px] lg:h-[150px] mx-auto mb-4 sm:mb-5 md:mb-6">
      <div className="h-full w-full relative">
        <div className="absolute top-4 sm:top-5 md:top-6 left-4 sm:left-5 md:left-6">
          <h3 className="text-dashboard-heading font-bold text-[20px] sm:text-[24px] md:text-[28px] lg:text-[32px]">
            Upcoming Events
          </h3>
        </div>

        <div className="absolute bottom-6 sm:bottom-7 md:bottom-8 lg:bottom-10 left-4 sm:left-5 md:left-6 right-4 sm:right-5 md:right-6 flex justify-between items-center">
          <button
            className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] lg:w-[24px] lg:h-[24px] flex items-center justify-center rounded cursor-pointer transition-all duration-200 hover:scale-110 ${
              isFirstPage
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
            onClick={!isFirstPage ? onPrevious : undefined}
            disabled={isFirstPage}
          >
            <MdArrowBackIos
              className={`text-sm sm:text-base md:text-lg lg:text-xl ${
                isFirstPage
                  ? "text-pagination-disabled"
                  : "text-pagination-active"
              }`}
            />
          </button>

          <span className="font-inter font-bold text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] leading-[16px] sm:leading-[18px] md:leading-[20px] lg:leading-[22px] text-pagination-text">
            Page {currentPage} of {totalPages}
          </span>

          <button
            className={`w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] md:w-[20px] md:h-[20px] lg:w-[24px] lg:h-[24px] flex items-center justify-center rounded cursor-pointer transition-all duration-200 hover:scale-110 ${
              isLastPage ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
            onClick={!isLastPage ? onNext : undefined}
            disabled={isLastPage}
          >
            <MdArrowForwardIos
              className={`text-sm sm:text-base md:text-lg lg:text-xl ${
                isLastPage
                  ? "text-pagination-disabled"
                  : "text-pagination-active"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
