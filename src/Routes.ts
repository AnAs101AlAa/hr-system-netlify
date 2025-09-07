import { HomePage, LoginPage } from "./pages";

const routes: { path: string; Component: React.FC }[] = [
  { path: "/", Component: HomePage },
  { path: "/login", Component: LoginPage },
];

export default routes;
