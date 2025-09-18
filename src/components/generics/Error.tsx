import { FaExclamationTriangle } from "react-icons/fa";

interface ErrorComponentProps {
  title: string;
  message: string;
}

export default function ErrorComponent({
  title,
  message,
}: ErrorComponentProps) {
  return (
      <div className="min-h-screen bg-background">
        <div className="w-full md:w-3/4 lg:w-10/12 m-auto rounded-xl shadow-md p-5 flex flex-col gap-4">
          {/* Error Container */}
          <div className="flex flex-col items-center justify-center py-16 px-4">
            {/* Error Icon */}
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <FaExclamationTriangle className="text-error text-3xl" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-error mb-4 text-center">
              {title}
            </h1>

            {/* Error Message */}
            <p className="text-base md:text-lg text-center mb-8 max-w-md">
              {message}
            </p>
          </div>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-xl p-4">
            <h3 className="font-semibold text-red-800 mb-2">
              Technical Details
            </h3>
            <div className="text-red-700 text-sm space-y-1">
              <p>• Check your internet connection</p>
              <p>• The page may be temporarily unavailable</p>
              <p>• Contact support if the problem persists</p>
            </div>
          </div>
        </div>
      </div>
  );
}
