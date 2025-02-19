import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Report } from "../components/homeComponents/ReportInterface";
import eventBus from "@//utils/eventBus";

const useSyncReportsOffline = () => {
  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      await SecureStore.deleteItemAsync("authToken");
      console.log("Todos os dados do AsyncStorage foram apagados.");
      eventBus.emit("updateSecureStore");
    } catch (error) {
      console.error("Erro ao limpar AsyncStorage:", error);
    }
  };

  const getReports = async () => {
    let storedReports = null;
    try {
      if (process.env.EXPO_PUBLIC_STORAGE_REPORTS) {
        storedReports = await AsyncStorage.getItem(
          process.env.EXPO_PUBLIC_STORAGE_REPORTS
        );
      } else {
        throw "Local Storage não encontrado!";
      }
      storedReports = storedReports ? JSON.parse(storedReports) : [];
    } catch (error) {
      console.error("[GET-REPORTS] : ", error);
    } finally {
      return storedReports;
    }
  };

  const getReport = async (id: string) => {
    const reports = await getReports();
    return reports
      ? (reports.filter((rep: Report) => rep.id === id)[0] as Report)
      : null;
  };

  const setReports = async (reports: Report[]) => {
    try {
      if (!process.env.EXPO_PUBLIC_STORAGE_REPORTS)
        throw "Não foi possível encontrar o storage";
      await AsyncStorage.setItem(
        process.env.EXPO_PUBLIC_STORAGE_REPORTS,
        JSON.stringify(reports)
      );
      eventBus.emit("updateStorageReports");
    } catch (error) {
      console.log("[SET-REPORTS] : ", error);
    }
  };

  const removeReportOffline = async (id: string) => {
    try {
      const reports = await getReports();
      // Filtra removendo o report com o ID correspondente
      const updatedReports = reports.filter((r: Report) => r.id !== id);

      if (updatedReports.length !== reports.length) {
        console.log(`[STORAGE] Report removido: ${id}`);
        await setReports(updatedReports);
      } else {
        console.log("Report nao encontrado [OFF_REPORTS]");
      }
    } catch (error) {
      console.error(`Erro ao remover o report de ${localStorage}:`, error);
    }
  };

  const updateReportOffline = async (updatedReport: Report) => {
    try {
      const reports = await getReports();

      const updateReports = reports.map((report: Report) =>
        report.id === updatedReport.id
          ? { ...report, ...updatedReport }
          : report
      );

      await setReports(updateReports);
      console.info(`[STORAGE] Report atualizado! ${updatedReport.id}`);
    } catch (error) {
      console.error("Erro ao atualizar o report STORAGE", error);
    }
  };

  const saveReportOffilne = async (report: Report) => {
    try {
      let reports = await getReports();

      if (!reports) return;
      reports.unshift(report);

      await setReports(reports);
      console.log(`[STORAGE] Report salvo: ${report.id}`);
    } catch (error) {
      console.error("Erro ao salvar report [STORAGE]:", error);
    }
  };

  return {
    clearAllStorage,
    saveReportOffilne,
    getReports,
    getReport,
    updateReportOffline,
    removeReportOffline,
  };
};

export default useSyncReportsOffline;
