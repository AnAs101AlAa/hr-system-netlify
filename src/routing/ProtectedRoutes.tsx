import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { systemApi } from "@/queries/axiosInstance";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils";

interface AuthState {
  user: {
    roles: string[];
  } | null;
}

interface RootState {
  auth: AuthState;
}

const MemberRoute = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) => {
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await systemApi.get("/api/v1/Auth/verify");
        console.log("Token verification response:", response.data);

      } catch (error) {
        console.error("Token verification failed:", error);
        toast.error(getErrorMessage(error)) ;
        // window.location.replace("/login");
      }
    };
    verifyToken();
  }, []);

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.some((role) => user.roles.includes(role)))
    return <Navigate to="/unauthorized" replace />;
  return <>{children}</>;
};

export default MemberRoute;
