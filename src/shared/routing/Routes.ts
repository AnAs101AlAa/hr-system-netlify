import { DashboardPage, LoginPage, EventDetails, PastEventsPage, FormView, FormSubmissionPage, UnauthorizedPage, FormBuilder, FormEditor, TeamsAdminPage } from "@/features";

const routes: { path: string; Component: React.FC; protected?: boolean; roles?: string[] }[] = [
  { path: "/", Component: DashboardPage, protected: true, roles: ["HR", "Head", "HighBoard", "Admin", "Vest"]},
  { path: "/login", Component: LoginPage },
  { path: "/events/:id", Component: EventDetails, protected: true, roles: ["HR", "Head", "HighBoard", "Admin", "Vest"] },
  { path: "/events", Component: PastEventsPage, protected: true, roles: ["HR", "Head", "HighBoard", "Admin", "Vest"] },
  { path: "/form/:formId", Component: FormView },
  { path: "/form/finish", Component: FormSubmissionPage },
  { path: "/unauthorized", Component: UnauthorizedPage },
  { path: "/form-builder", Component: FormBuilder, protected: true, roles: ["HR", "Head", "HighBoard", "Admin"] },
  { path: "/form-builder/:formId", Component: FormEditor, protected: true, roles: ["HR", "Head", "HighBoard", "Admin"] },
  { path: "form-builder/preview", Component: FormView },
  { path: "/judging-system", Component: TeamsAdminPage, protected: true, roles: ["Admin"] }
];

export default routes;
