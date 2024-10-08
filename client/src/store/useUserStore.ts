import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";

const API_END_POINT = "http://localhost:4001/api/v1/user"; // Ensure the correct API endpoint
axios.defaults.withCredentials = true;

type User = {
  fullname: string;
  email: string;
  contact: number;
  address: string;
  city: string;
  country: string;
  profilePicture: string;
  admin: boolean;
  isVerified: boolean;
};

type UserState = {
  user: User | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  loading: boolean;
  signup: (input: SignupInputState) => Promise<void>;
  login: (input: LoginInputState) => Promise<void>;
  verifyEmail: (verificationCode: string) => Promise<void>;
  checkAuthentication: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (input: any) => Promise<void>;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      loading: false, // Change initial loading state to false
      // signup api implementation
      signup: async (input: SignupInputState) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${API_END_POINT}/signup`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              user: response.data.user,
              isAuthenticated: true,
            });
          } else {
            // Handle unsuccessful response
            throw new Error(response.data.message);
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "An unexpected error occurred. Please try again.";
          toast.error(errorMessage);
        } finally {
          set({ loading: false }); // Reset loading state in finally block
        }
      },

      login: async (input: LoginInputState) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${API_END_POINT}/login`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              user: response.data.user,
              isAuthenticated: true,
            });
          } else {
            // Handle unsuccessful response
            throw new Error(response.data.message);
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "An unexpected error occurred. Please try again.";
          toast.error(errorMessage);
        } finally {
          set({ loading: false }); // Reset loading state in finally block
        }
      },

      verifyEmail: async (verificationCode: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/verify-email`,
            { verificationCode },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              loading: false,
              user: response.data.user,
              isAuthenticated: true,
            });
          }
        } catch (error: any) {
          toast.success(error.response.data.message);
          set({ loading: false });
        }
      },

      checkAuthentication: async () => {
        try {
          set({ isCheckingAuth: true });
          const response = await axios.get(`${API_END_POINT}/check-auth`);
          if (response.data.success) {
            set({
              loadig: false,
              user: response.data.user,
              isAuthenticated: true,
              isCheckingAuth: false,
            });
          }
        } catch (error) {
          set({
            loading: false,
            isAuthenticated: false,
            isCheckingAuth: false,
          });
        }
      },

      logout: async (input: LoginInputState) => {
        set({ loading: true });
        try {
          const response = await axios.post(`${API_END_POINT}/logout`, input, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.data.success) {
            toast.success(response.data.message);
            set({
              user: response.data.user,
              isAuthenticated: false,
            });
          } else {
            // Handle unsuccessful response
            throw new Error(response.data.message);
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "An unexpected error occurred. Please try again.";
          toast.error(errorMessage);
        } finally {
          set({ loading: false }); // Reset loading state in finally block
        }
      },

      forgotPassword: async (email: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/forgot-password`,
            { email }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      resetPassword: async (token: string, newPassword: string) => {
        try {
          set({ loading: true });
          const response = await axios.post(
            `${API_END_POINT}/reset-password/${token}`,
            { newPassword }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ loading: false });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
          set({ loading: false });
        }
      },

      updateProfile: async (input: any) => {
        try {
          const response = await axios.put(
            `${API_END_POINT}/profile/update`,
            input,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            set({ user: response.data.user, isAuthenticated: true });
          }
        } catch (error: any) {
          toast.error(error.response.data.message);
        }
      },
    }),
    {
      name: "user-name",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
