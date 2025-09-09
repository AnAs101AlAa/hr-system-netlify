import { HomePage, LoginPage, EventDetails, PastEventsPage, FormView } from "./pages";

const routes: { path: string; Component: React.FC }[] = [
  { path: "/", Component: HomePage },
  { path: "/login", Component: LoginPage },
  { path: "/events/:id", Component: EventDetails },
  { path: "/events", Component: PastEventsPage },
  { path: "/form/:formId", Component: FormView}
];

export default routes;
