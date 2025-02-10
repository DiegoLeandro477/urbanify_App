import { useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { styles } from "./styles";

const ReportDetails = () => {
  const params = useLocalSearchParams();

  return <View style={styles.container}></View>;
};

export default ReportDetails;
