import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";
import styles from "./styles";
import useProtectedRoute from "@//app/middlewares/middleware";
import { Report } from "@//components/homeComponents/ReportInterface";
import { useEffect, useState } from "react";
import useSyncReports from "@//hooks/useSyncReportsOffline";
import { ClassColor, colors, Font } from "@//styles/global";
import { Ionicons } from "@expo/vector-icons";
import ButtonCustom from "@//components/buttonCustom";
import { useReports } from "@//hooks/useReports";
import useSyncReportsOnline from "@//hooks/useSyncReportsOnline";
const ReportDetails = () => {
  useProtectedRoute();
  const params = useLocalSearchParams();
  const { getReport } = useSyncReports();
  const [item, setItem] = useState<Report | null>(null);
  const { getReportOnline } = useSyncReportsOnline();
  useEffect(() => {
    (async () => {
      if (params.id) {
        const report = await getReport(params.id as string);
        if (report) {
          setItem(null);
          setItem((await getReportOnline(report)) || null);
        }
      }
    })();
  }, [params.id]);

  if (!item) {
    return <ActivityIndicator style={styles.loadingIsNull} size={"large"} />;
  }

  return (
    <>
      <Text>{item.id}</Text>
      <View style={styles.container}>
        <Text style={[Font.xl, ClassColor.c0]}>
          Fluxo de relato e reparo da Via
        </Text>
        <View style={styles.container_timeline}>
          <View style={styles.sub_container}>
            <Ionicons name="star" size={24} style={styles.icon} />
            <View style={styles.sub_container_info}>
              <Text style={[Font.l, ClassColor.c2]}>Conclusão da obra</Text>
              <View style={styles.sub_container_info_02}>
                <Text style={[Font.s]}>{item.date}</Text>
                <ButtonCustom
                  onPress={() => null}
                  title={"VER REGISTRO"}
                  styleCustom={[
                    {
                      alignSelf: "flex-start",
                      paddingVertical: 3,
                    },
                  ]}
                  textCustom={[Font.xs, ClassColor.c12]}
                />
              </View>
            </View>
          </View>
          <View
            style={[
              styles.BeforeElement,
              { backgroundColor: true && colors.p1 },
            ]}
          />

          <View
            style={[styles.sub_container, true && styles.check_sub_container]}
          >
            <Ionicons
              name="checkmark-sharp"
              size={24}
              style={[styles.icon, true && styles.check_icon]}
            />
            <Ionicons
              name="checkmark-sharp"
              size={24}
              style={[
                styles.icon,
                true && styles.check_icon,
                {
                  left: 10,
                  top: 11,
                  position: "absolute",
                  backgroundColor: "transparent",
                },
              ]}
            />
            <View style={styles.sub_container_info}>
              <Text style={[Font.l, true ? ClassColor.p1 : ClassColor.c2]}>
                Avaliado
              </Text>
              <View style={styles.sub_container_info_02}>
                <Text style={[Font.s]}>{item.date}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default ReportDetails;
