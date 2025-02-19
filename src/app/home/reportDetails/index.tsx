import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import styles from "./styles";
import useProtectedRoute from "@//app/middlewares/middleware";
import { Report } from "@//components/homeComponents/ReportInterface";
import { useEffect, useState } from "react";
import useSyncReports from "@//hooks/useSyncReportsOffline";
import { ClassColor, Font } from "@//styles/global";

const ReportDetails = () => {
  useProtectedRoute();
  const params = useLocalSearchParams();
  const { getReport } = useSyncReports();
  const [item, setItem] = useState<Report | null>(null);

  useEffect(() => {
    (async () => {
      if (params.id) {
        const report = await getReport(params.id as string);
        if (report) setItem(report);
      }
    })();
  }, [params.id]);

  if (!item) {
    return <ActivityIndicator style={styles.loadingIsNull} size={"large"} />;
  }

  return (
    <View style={styles.container}>
      <Text style={[Font.xl, ClassColor.c0]}>
        Fluxo de relato e reparo da Via
      </Text>
      <Text>{item.id}</Text>
    </View>
  );
};

export default ReportDetails;
