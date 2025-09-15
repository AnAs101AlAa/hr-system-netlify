import { HomePage, LoginPage, EventDetails, PastEventsPage, FormView, FormSubmissionPage, UnauthorizedPage } from "@/pages";

const routes: { path: string; Component: React.FC; protected?: boolean; role?: string }[] = [
  { path: "/", Component: HomePage, protected: true, role: "member" },
  { path: "/login", Component: LoginPage },
  { path: "/events/:id", Component: EventDetails, protected: true, role: "member" },
  { path: "/events", Component: PastEventsPage, protected: true, role: "member" },
  { path: "/form/:formId", Component: FormView },
  { path: "/form/finish", Component: FormSubmissionPage },
  { path: "/unauthorized", Component: UnauthorizedPage }
];

export default routes;
