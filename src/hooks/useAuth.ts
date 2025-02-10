import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { tokenDecoded } from "./useSyncReports";

export default function useAuth() {
  const [email, setEmail] = useState<string>("admin@admin.com");
  const [password, setPassword] = useState<string>("admin123");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorEmailOrPassword, setErrorEmailOrPassword] =
    useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const setDec = (token: string) => {
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token: ", decoded);
      return decoded as tokenDecoded;
    } catch (error) {
      console.error("Erro ao decoidficar o token: ", error);
      return null;
    }
  };

  const signIn = async () => {
    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    try {
      // 🔹 Substitua pela sua API de autenticação
      const response = await axios.post(
        `${process.env.EXPO_BASE_URL}/user/login`,
        {
          email,
          password,
        }
      );

      const { token } = response.data;
      setDec(token);
      // 🔹 Salva o token no AsyncStorage
      await SecureStore.setItemAsync("authToken", token);
      setIsAuthenticated(true); // Marca como autenticado após o login

      console.log("Login bem-sucedido!");
      setErrorEmailOrPassword(false);
      setTimeout(() => {
        setLoading(false);
        router.replace("/home"); // replace evita que o usuário volte para a tela de login
      }, 1000);
    } catch (error) {
      console.error("Erro no login:", error);
      setErrorEmailOrPassword(true);
      setLoading(false);
    }
  };

  const singOut = async () => {
    await SecureStore.deleteItemAsync("authToken");
    console.log("Usuário deslogado!");
    router.push("/auth/login");
  };

  useEffect(() => {
    async function checkAuth() {
      const token = await SecureStore.getItemAsync("authToken");
      if (token) {
        setIsAuthenticated(true); // Token encontrado, marca como autenticado
      } else {
        setIsAuthenticated(false); // Não encontrou o token, marca como deslogado
      }
    }
    checkAuth();
  }, []);

  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    signIn,
    singOut,
    setDec,
    errorEmailOrPassword,
    isAuthenticated,
  };
}
