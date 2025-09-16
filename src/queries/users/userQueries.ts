import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "./userApi";
import { useDispatch } from "react-redux";
import { setUser, logout as logoutAction } from "@/redux/slices/authSlice";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils";

export const userKeys = {
  all: ["user"] as const,
  session: () => [...userKeys.all, "session"] as const,
  login: () => [...userKeys.all, "login"] as const,
  logout: () => [...userKeys.all, "logout"] as const,
};

const userApiInstance = new UserApi();

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (credentials: Parameters<typeof userApiInstance.login>[0]) => 
      userApiInstance.login(credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.session() });
      const { id = "", email = "", name = "", profileImageUrl = "", phoneNumber = "", roles = [] } = data.data || {};
      dispatch(setUser({ id, email, name, profileImageUrl, phoneNumber, roles }));
      toast.success("Login successful! Welcome back!");
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(`Login failed: ${errorMessage}`);
      console.error("Login failed:", error);
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => userApiInstance.logout(),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userKeys.session() });
      dispatch(logoutAction());
      toast.success("Logged out successfully!");
    },
    onError: (error) => {
      const errorMessage = getErrorMessage(error);
      toast.error(`Logout failed: ${errorMessage}`);
      console.error("Logout failed:", error);
    },
  });
};

export const useSession = () => {
  return useQuery({
    queryKey: userKeys.session(),
    queryFn: () => userApiInstance.session(),
    staleTime: 1000 * 60 * 5,
  });
};
