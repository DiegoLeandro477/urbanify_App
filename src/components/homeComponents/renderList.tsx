import React from "react";
import { View, Image, Text, ActivityIndicator, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { UnknownInputParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import styles from "@//app/home/styles";
import { Report } from "./ReportInterface";
import { ClassColor, colors, Font } from "@//styles/global";
import { SeverityEnum } from "@//constants/SeverityEnum";

interface RenderReportProps {
  item: Report;
}

const RenderReport: React.FC<RenderReportProps> = ({ item }) => {
  const router = useRouter();

  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/home/reportDetails",
          params: { id: item.id } as unknown as UnknownInputParams,
        })
      }
      style={styles.reportCard}
    >
      <View style={styles.imageCard}>
        {/* Exibe a imagem do report, se disponível */}
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: "100%" }}
        />

        {!item.coodenates && (
          <ActivityIndicator
            style={styles.loading}
            size="large"
            color={colors.p1}
          />
        )}
      </View>

      <View style={styles.cardInfo}>
        <View style={styles.reportLocationView}>
          <Text
            style={[Font.xs, ClassColor.c0, { width: "85%" }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.street}
          </Text>
          <Ionicons
            style={styles.icon}
            name={
              item.submit ? "checkmark-circle-outline" : "alert-circle-outline"
            }
            size={20}
          />
        </View>
        {/* Gravidade do report */}
        <View style={styles.cardSubInfo}>
          <Text
            style={[
              styles.severity,
              item.severity === SeverityEnum.MODERADO
                ? styles.severityModerado
                : styles.severityGrave,
            ]}
          >
            {SeverityEnum[item.severity]}
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[Font.xs, ClassColor.c5]}>{item.date}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default RenderReport;
