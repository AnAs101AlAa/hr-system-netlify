import { HomePage, LoginPage , EventDetails } from "./pages";

const routes: { path: string; Component: React.FC }[] = [
  { path: "/", Component: HomePage },
  { path: "/login", Component: LoginPage },
  {path: "/events/:id", Component: EventDetails}
];

export default routes;
