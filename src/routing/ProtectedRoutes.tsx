import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MemberRoute = ({ children, allowedRole }: { children: React.ReactNode; allowedRole?: string }) => {
  const { user } = useSelector((state: any) => state.auth);
  if (!user) return <Navigate to="/unauthorized" replace />;
  if (allowedRole && user.role !== allowedRole) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
};

export default MemberRoute;