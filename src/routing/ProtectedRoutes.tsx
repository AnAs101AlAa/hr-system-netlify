import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const MemberRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { user } = useSelector((state: any) => state.auth);
    
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
};

export default MemberRoute;