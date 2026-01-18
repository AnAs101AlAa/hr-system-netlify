import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "@/shared/routing/Routes";
import { Toaster } from "react-hot-toast";
import MemberRoute from "@/shared/routing/ProtectedRoutes";
import { useEffect, useState } from "react";

function App() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDark));
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <div>
      <BrowserRouter>
        <Toaster containerClassName="text-[14px] md:text-[15px] lg:text-[16px]" />
        <Routes>
          {routes.map(
            ({ path, Component, protected: isProtected, roles }, index) =>
              isProtected ? (
                <Route
                  key={index}
                  path={path}
                  element={
                    <MemberRoute allowedRoles={roles}>
                      <Component />
                    </MemberRoute>
                  }
                />
              ) : (
                <Route key={index} path={path} element={<Component />} />
              ),
          )}
        </Routes>
        <button
          onClick={() => setIsDark(!isDark)}
          className="fixed top-4 right-4 md:bottom-5 md:top-auto md:right-5 z-50 p-2 md:p-3 rounded-full shadow-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 transition-colors"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? "🌙" : "☀️"}
        </button>
      </BrowserRouter>
    </div>
  );
}

export default App;
