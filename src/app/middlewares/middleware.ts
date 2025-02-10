import useAuth from "@//hooks/useAuth";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export const useProtectedRoute = async () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const token = await SecureStore.getItemAsync("authToken");
  useEffect(() => {
    console.log(
      "[MIDDLEWARE] notToken: ",
      !token,
      " | notAuth: ",
      !isAuthenticated
    );
    if (!isAuthenticated || !token) {
      console.log("Usuário não autenticado, redirecionando...");
      router.replace("/auth/login"); // Redireciona para login se não estiver autenticado
    }
  }, []);
};
