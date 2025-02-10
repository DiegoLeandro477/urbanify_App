import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import styles from "./styles";
import useProtectedRoute from "../middlewares/middleware";

const ReportDetails = () => {
  useProtectedRoute();
  const params = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text>Tudo certo: {params.id}</Text>
    </View>
  );
};

export default ReportDetails;
