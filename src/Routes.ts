import {
  HomePage,
  LoginPage,
  EventDetails,
  PastEventsPage,
  FormView, 
  FormSubmissionPage,
  ScanQRPage,
} from "./pages";

const routes: { path: string; Component: React.FC }[] = [
  { path: "/", Component: HomePage },
  { path: "/login", Component: LoginPage },
  { path: "/events/:id", Component: EventDetails },
  { path: "/events", Component: PastEventsPage },
  { path: "/form/:formId", Component: FormView},
  { path: "/form/finish", Component: FormSubmissionPage },
  { path: "/events/scan-qr", Component: ScanQRPage },
];

export default routes;
