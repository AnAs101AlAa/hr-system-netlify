import { HomePage, LoginPage, EventDetails, PastEventsPage } from "./pages";

const routes: { path: string; Component: React.FC }[] = [
  { path: "/", Component: HomePage },
  { path: "/login", Component: LoginPage },
  { path: "/events/:id", Component: EventDetails },
  { path: "/events", Component: PastEventsPage },
];

export default routes;
