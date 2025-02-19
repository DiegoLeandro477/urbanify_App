import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useAuth() {
  const [email, setEmail] = useState<string>("admin@admin.com");
  const [password, setPassword] = useState<string>("admin123");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorEmailOrPassword, setErrorEmailOrPassword] =
    useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const signIn = async () => {
    if (!email || !password) {
      alert("Preencha todos os campos!");
      return;
    }
    setLoading(true);
    console.log("Login: ", { email, password });
    try {
      // 🔹 Substitua pela sua API de autenticação
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/user/login`,
        {
          email,
          password,
        }
      );
      const { token } = response.data;
      // 🔹 Salva o token no SecureStore
      await SecureStore.setItemAsync("authToken", token);
      setIsAuthenticated(true); // Marca como autenticado após o login

      console.log("Login bem-sucedido!");
      setErrorEmailOrPassword(false);
      setTimeout(() => {
        router.replace("/home"); // replace evita que o usuário volte para a tela de login
      }, 1000);
    } catch (err) {
      console.error("[LOGIN]:", err);
      setLoading(false);
      setErrorEmailOrPassword(true);
    }
  };

  const singOut = async () => {
    await SecureStore.deleteItemAsync("authToken");
    await AsyncStorage.clear();
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
    errorEmailOrPassword,
    isAuthenticated,
  };
}
