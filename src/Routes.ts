import { LoginPage } from "./pages";
import Dashboard from "./components/Dashboard";

const routes: { path: string; Component: React.FC }[] = [
  { path: "/login", Component: LoginPage },
  { path: "/", Component: Dashboard },
];

export default routes;
