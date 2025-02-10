import { colors } from "@//styles/global";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  notificationContainer: {
    zIndex: 10,
    position: "absolute",
    width: "100%",
    bottom: 20,
    transform: [{ translateX: "-50%" }, { translateY: "-50%" }],
  },
  photoBox: {
    width: "100%",
    height: 150,
    borderWidth: 2,
    borderColor: colors.p1,
    borderRadius: 8,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#EAF4FF",
  },
  photoText: {
    color: colors.p1,
    fontSize: 16,
    marginTop: 8,
  },
  preview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  reportsTitle: {
    marginBottom: 8,
  },
  fletListOut: {},
  reportCard: {
    width: 200,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.c12,
    elevation: 4,
  },
  fletListIn: {
    padding: 10,
    gap: 20,
  },
  imageCard: {
    width: "100%",
    height: 164,
  },
  deleteButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.c6,
    paddingRight: 30,
    paddingLeft: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  loading: {
    position: "absolute",
    backgroundColor: "rgba(0,0,0,.5)",
    width: "100%",
    height: "100%",
  },
  erroSubmit: {
    position: "absolute",
    backgroundColor: "rgba(255, 236, 236, 0.56)",
    bottom: 10,
    right: -10,
    marginRight: 20,
    borderRadius: 10,
  },
  cardInfo: {
    display: "flex",
    padding: 10,
  },
  cardSubInfo: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  reportLocationView: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
  },
  icon: {
    color: colors.p3,
    borderRadius: 50,
    boxShadow: "0 0 0 1px #ccc",
    marginBottom: 5,
  },
  severity: {
    marginVertical: "auto",
    paddingHorizontal: 10,
    alignSelf: "flex-start", // conteiner do tamanho do conteudo
    textTransform: "uppercase",
    color: colors.c4,
    borderRadius: 8,
  },
  severityGrave: {
    backgroundColor: "rgb(254, 179, 179)",
  },
  severityModerado: {
    backgroundColor: "rgb(255, 243, 181)",
  },
  cardReports: {
    width: "100%",
    paddingHorizontal: 10,
  },
});

export default styles;
