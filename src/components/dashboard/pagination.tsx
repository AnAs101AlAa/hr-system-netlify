import { MdArrowBackIos, MdArrowForwardIos } from "react-icons/md";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  title:string;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  title
}: PaginationProps) => {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="relative mx-auto my-8 sm:my-9 md:my-10">
      <div className="h-full w-full relative gap-6 flex flex-col ">
        <div className="">
          <h3 className="text-dashboard-heading font-bold text-[18px] sm:text-[22px] md:text-[25px] lg:text-[28px]">
            {title}
          </h3>
        </div>

        <div className="flex justify-center gap-5 md:gap-10 items-center">
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
        <hr className="border-t-2 border-gray-200 -mt-2" />
      </div>
    </div>
  );
};

export default Pagination;
