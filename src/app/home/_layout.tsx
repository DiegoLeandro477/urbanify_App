import React from "react";
import { Stack } from "expo-router";
import Header from "@//components/headerHome/hearderHome";
import HeaderDetails from "@//components/headerDetails/headerDetails";

export default function Layout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="index"
          options={{
            header: () => <Header />,
          }}
        />
        <Stack.Screen
          name="reportDetails/index"
          options={{
            header: () => <HeaderDetails />,
          }}
        />
      </Stack>
    </>
  );
}
