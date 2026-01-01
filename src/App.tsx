import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "@/shared/routing/Routes";
import { Toaster } from "react-hot-toast";
import MemberRoute from "@/shared/routing/ProtectedRoutes";

function App() {
  return (
    <div className="dark">
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
              )
          )}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
