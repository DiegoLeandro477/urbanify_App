import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Report } from "../components/homeComponents/ReportInterface";
import eventBus from "@//utils/eventBus";

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);

  // Função para carregar os reports
  const loadReports = async () => {
    try {
      const storedReportsOffline = await AsyncStorage.getItem(
        process.env.EXPO_PUBLIC_STORAGE_REPORTS!
      );

      const reports = storedReportsOffline
        ? JSON.parse(storedReportsOffline)
        : [];
      // Combina ambos os reports (online + offline)
      setReports(reports);
    } catch (error) {
      console.error("[LOADING] Erro ao carregar reports:", error);
    }
  };

  // Monitorar mudanças no AsyncStorage
  useEffect(() => {
    const listener = eventBus.addListener("updateStorageReports", loadReports);

    return () => listener.remove(); // Remove o listener ao desmontar
  }, []);

  return { reports, loadReports };
};
