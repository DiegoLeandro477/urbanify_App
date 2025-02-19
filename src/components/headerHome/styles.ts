import { colors } from "@//styles/global";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    overflow: "hidden",
    height: 80,
    paddingHorizontal: 10,
    backgroundColor: colors.p1,
    elevation: 1,
  },
  buttonSingOut: {
    backgroundColor: "rgba(255,255,255, .2)",
    borderRadius: 50,
  },
});
