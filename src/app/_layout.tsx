import React from "react";
import { Stack } from "expo-router";
import Header from "@//components/headerComponent/hearder";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";

export default function Layout() {
  useEffect(() => {
    // Oculta a tela de splash manualmente
    const hideSplash = async () => {
      await SplashScreen.preventAutoHideAsync();
      await SplashScreen.hideAsync();
    };
    hideSplash();
  }, []);
  return (
    <>
      <StatusBar
        hidden={false}
        barStyle="default"
        backgroundColor={"rgba(0,0,0,1)"}
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen
          name="home/index"
          options={{
            headerShown: true,
            header: () => <Header />,
          }}
        />
        <Stack.Screen
          name="home/reportDetails/index"
          options={{
            headerShown: true,
            title: "Detalhes",
          }}
        />
      </Stack>
    </>
  );
}
