import type { LoginFormData } from "@/schemas/authSchemas";

export const loginRequest = async (
  payload: LoginFormData
): Promise<unknown> => {
  //Add the actual fetch api call when backend ready

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(payload);
    }, 1000);
  });
};
