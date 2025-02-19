import { colors } from "@//styles/global";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  loadingIsNull: {
    margin: 40,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  container_timeline: {
    marginTop: 48,
  },
  sub_container: {
    margin: 10,
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
  },
  check_sub_container: {
    backgroundColor: "rgba(0, 123, 255, .2)",
  },
  sub_container_info: {
    justifyContent: "center",
  },
  sub_container_info_02: { flexDirection: "row", gap: 15 },
  icon: {
    backgroundColor: colors.c2,
    color: colors.c6,
    borderRadius: 50,
    padding: 15,
  },
  check_icon: {
    backgroundColor: "rgba(0, 123, 255, .3)",
    color: colors.p1,
    textShadowColor: colors.p1,
    textShadowOffset: { width: 0.5, height: 1 },
    textShadowRadius: 1,
  },
  BeforeElement: {
    width: 4,
    height: 64,
    marginLeft: 45,
    backgroundColor: colors.c2,
  },
});

export default styles;
