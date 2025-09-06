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
    <div className="relative h-[109px] mx-auto mb-4">
      <div className="absolute inset-0 bg-white border border-dashboard-card-border shadow-md rounded-[16px]">
        <div className="absolute top-4 left-4">
          <h3 className="text-dashboard-heading font-bold text-[16px]">
            Upcoming Events
          </h3>
        </div>

        <div className="absolute bottom-8 left-4 right-4 flex justify-between items-center">
          <div
            className="w-[12px] h-[12px] flex items-center justify-center rounded cursor-pointer"
            onClick={onPrevious}
          >
            <MdArrowBackIos
              className={`text-xs ${
                isFirstPage
                  ? "text-pagination-disabled"
                  : "text-pagination-active"
              }`}
            />
          </div>

          <span className="font-inter font-bold text-[13.5px] leading-[16px] text-pagination-text">
            Page {currentPage} of {totalPages}
          </span>

          <div
            className="w-[12px] h-[12px] flex items-center justify-center rounded cursor-pointer"
            onClick={onNext}
          >
            <MdArrowForwardIos
              className={`text-xs ${
                isLastPage
                  ? "text-pagination-disabled"
                  : "text-pagination-active"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
