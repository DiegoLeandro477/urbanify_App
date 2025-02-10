import { colors } from "@//styles/global";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  view: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.p4,
  },
  container: {
    width: "80%",
    backgroundColor: "rgba(255,255,255,.4)",
    padding: 20,
    borderRadius: 10,
  },
  viewInput: {
    borderBottomWidth: 1,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
  },
});

export default styles;
