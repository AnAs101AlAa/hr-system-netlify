import { HomePage, LoginPage, EventDetails, PastEventsPage, FormView, FormSubmissionPage, UnauthorizedPage, FormBuilder, FormEditor } from "@/pages";

const routes: { path: string; Component: React.FC; protected?: boolean; roles?: string[] }[] = [
  { path: "/", Component: HomePage, protected: true, roles: ["HR", "Head", "HighBoard", "Admin", "Vest"]},
  { path: "/login", Component: LoginPage },
  { path: "/events/:id", Component: EventDetails, protected: true, roles: ["HR", "Head", "HighBoard", "Admin", "Vest"] },
  { path: "/events", Component: PastEventsPage, protected: true, roles: ["HR", "Head", "HighBoard", "Admin", "Vest"] },
  { path: "/form/:formId", Component: FormView },
  { path: "/form/finish", Component: FormSubmissionPage },
  { path: "/unauthorized", Component: UnauthorizedPage },
  { path: "/form-builder", Component: FormBuilder, protected: true, roles: ["Head", "HighBoard", "Admin"] },
  { path: "/form-builder/:formId", Component: FormEditor, protected: true, roles: ["Head", "HighBoard", "Admin"] },
];

export default routes;
