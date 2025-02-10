import React, { useEffect } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { Redirect, router, SplashScreen } from "expo-router";
import * as SecureStore from "expo-secure-store";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
  Poppins_500Medium,
} from "@expo-google-fonts/poppins";

export default function Index() {
  let [fontsLoaded] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
    Poppins_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    (async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        if (token) {
          router.push({
            pathname: "/home",
          });
        } else {
          router.push("/auth/login");
        }
      } catch (error) {
        alert("Erro ao verificar o login");
        console.error("Failed to check login status", error);
      }
    })();
  }, []);

  if (!fontsLoaded) {
    return null; // Aguarda o carregamento das fontes antes de renderizar a UI
  }
  return <Redirect href="/home" />; // Redireciona para a Home ao iniciar o app
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
