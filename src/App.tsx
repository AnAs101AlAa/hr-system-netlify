import { BrowserRouter, Routes, Route } from "react-router-dom";
import routes from "./routing/Routes";
import { Toaster } from "react-hot-toast";
import MemberRoute from "./routing/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
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
  );
}

export default App;
