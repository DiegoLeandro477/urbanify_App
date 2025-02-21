import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import { Report } from "../components/homeComponents/ReportInterface";
import eventBus from "@//utils/eventBus";
import useProtectedRoute from "@//app/middlewares/middleware";
import useSyncReportsOffline from "./useSyncReportsOffline";
import useSyncReportsOnline from "./useSyncReportsOnline";
import * as Location from "expo-location";

export const useReports = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const { saveReportOffilne, updateReportOffline, getReports } =
    useSyncReportsOffline();
  const { saveReportOnline } = useSyncReportsOnline();

  const [connect, setConnect] = useState<boolean>(false);

  const createReport = async (severity: number, photo: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
    // Cria um novo relatório com a foto capturada
    const newReport: Report = {
      id: Math.round(
        Date.now() / Math.floor(Math.random() * (1000 + 1))
      ).toString(), // Gera um novo ID
      severity: severity,
      submit: false,
      image: photo!,
      date: formattedDate,
    };

    saveReportOffilne(newReport);
    // Inicia o carregamento da localização
    let attempts = 0;
    // Tentar até 5 vezes
    while (attempts < 5) {
      try {
        const currentLocation = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });

        // Atualiza o relatório com a nova localização
        newReport.street = `${address[0].street || "Undefined"}`;
        newReport.district = `${address[0].district || "Undefined"}`;
        newReport.subregion = `${address[0].subregion || "Undefined"}`;
        newReport.coodenates = {
          latitude: currentLocation.coords.latitude.toString(),
          longitude: currentLocation.coords.longitude.toString(),
        };

        break;
      } catch (error) {
        console.warn("Tentando obter localização");

        // Se a primeira tentativa falhar, aguarda 5 segundos e tenta novamente
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Atraso de 5 segundos
      }

      attempts++;
    }
    await updateReportOffline(newReport);
    saveReportOnline(newReport);
  };

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

  const sendReports = async () => {
    try {
      const reports = await getReports();
      if (!reports) return;
      const reportsOffline = reports.filter(
        (rep: Report) => rep.submit === false
      );
      if (reportsOffline.length > 0)
        console.log(`[STORAGE] Reports OFF >> [${reportsOffline.length}]`);
      for (const report of reports) {
        if (!report.submit) await saveReportOnline(report);
      }
    } catch (error) {
      console.error("[sendPeding] Erro na requisição POST:", error);
    }
  };

  // Monitorar mudanças no AsyncStorage
  useEffect(() => {
    const listener = eventBus.addListener("updateStorageReports", loadReports);
    const listenerToken = eventBus.addListener("updateSecureStore", () =>
      useProtectedRoute()
    );

    const handleConnectionChange = async (state: NetInfoState) => {
      setConnect(state.isConnected === true);
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectionChange);

    return () => {
      unsubscribe();
      listenerToken.remove();
      listener.remove();
    }; // Remove o listener ao desmontar
  }, []);

  useEffect(() => {
    if (connect) {
      console.info("está conectado a internet!");
      sendReports();
    }
  }, [connect]);

  return { reports, loadReports, createReport };
};
