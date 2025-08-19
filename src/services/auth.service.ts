import { decodedToken } from "@/helpers/jwtDecode";

export const storeUserInfo = (accessToken: string) => {
  if (!accessToken || typeof window === "undefined") return;

  localStorage.setItem("accessToken", accessToken);
};

export const getUserInfo = () => {
  return {
    userId: "1",
    role: "SuperAdmin",
    user: "John Doe",
    userName: "John Doe",
    email: "john.doe@example.com",
  };
};

export const removeUserInfo = () => {
  if (typeof window !== "undefined") localStorage.removeItem("accessToken");
};

export const getAccessToken = () => {
  if (typeof window !== "undefined") return localStorage.getItem("accessToken");
};

export const isLoggedIn = () => {
  return true;
};
