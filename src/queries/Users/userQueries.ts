import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { login, logout, session } from "./userApi";
import { useDispatch } from "react-redux";
import { setUser, logout as logoutAction } from "@/redux/slices/authSlice";

export const userKeys = {
  all: ["user"] as const,
  session: () => [...userKeys.all, "session"] as const,
  login: () => [...userKeys.all, "login"] as const,
  logout: () => [...userKeys.all, "logout"] as const,
};

// Login mutation
export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.session() });
      dispatch(setUser(data.user ?? data)); //Depending on The API response :(
      console.log("Login successful");
    },
    onError: () => {
        console.log("Login failed");
    },
  });
};

// Logout mutation
export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userKeys.session() });
      dispatch(logoutAction());
      console.log("Logout successful");
    },
    onError: () => {
      console.log("Logout failed");
    },
  });
};

export const useSession = () => {
  return useQuery({
    queryKey: userKeys.session(),
    queryFn: session,
    staleTime: 1000 * 60 * 5,
  });
};
