import { useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Report } from "../components/homeComponents/ReportInterface";
import axios from "axios";
import eventBus from "@//utils/eventBus";
import useAuth from "./useAuth";
import { useReports } from "./useReports";
import { JwtPayload } from "jwt-decode";

export interface tokenDecoded {
  exp: number;
  iat: number;
  id: { S: string };
  role: { S: string };
}

const useSyncReports = () => {
  const { setDec } = useAuth();
  const { reports } = useReports();
  const clearAllStorage = async () => {
    try {
      await AsyncStorage.clear();
      await SecureStore.deleteItemAsync("authToken");
      console.log("Todos os dados do AsyncStorage foram apagados.");
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

  const setReports = async (reports: Report[]) => {
    try {
      if (!process.env.EXPO_PUBLIC_STORAGE_REPORTS)
        throw "Não foi possível encontrar o storage";
      await AsyncStorage.setItem(
        process.env.EXPO_PUBLIC_STORAGE_REPORTS,
        JSON.stringify(reports)
      );
    } catch (error) {
      console.log("[SET-REPORTS] : ", error);
    }
  };

  const removeReport = async (report: Report) => {
    try {
      const reports = await getReports();
      // Filtra removendo o report com o ID correspondente
      const updatedReports = reports.filter((r: Report) => r.id !== report.id);

      if (updateReport.length !== reports.length) {
        console.log("Report removido [OFF_REPORTS]");
        await setReports(reports);
        eventBus.emit("updateStorageReports");
      } else {
        console.log("Report nao encontrado [OFF_REPORTS]");
      }
    } catch (error) {
      console.error(`Erro ao remover o report de ${localStorage}:`, error);
    }
  };

  const updateReport = async (updatedReport: Report) => {
    try {
      const reports = await getReports();

      const updateReports = reports.map((report: Report) =>
        report.id === updatedReport.id
          ? { ...report, ...updatedReport }
          : report
      );

      await setReports(updateReports);
      console.info("Report atualizado [STORAGE]");
      eventBus.emit("updateStorageReports");
    } catch (error) {
      console.error("Erro ao atualizar o report STORAGE", error);
    }
  };

  const saveReport = async (report: Report) => {
    try {
      let reports = await getReports();

      if (!reports) return;
      reports.unshift(report);

      await setReports(reports);
      console.log("Report salvo [STORAGE].");
      eventBus.emit("updateStorageReports");
    } catch (error) {
      console.error("Erro ao salvar report [STORAGE]:", error);
    }
  };
  const submit = async (report: Report) => {
    try {
      const formData = new FormData();
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      const decode = setDec(token);
      if (!decode) return;
      const data = {
        user_id: decode.id.S,
        coordinates: {
          latitude: report.location?.latitude,
          longitude: report.location?.longitude,
        },
        district: report.district,
        street: report.street,
        severity: report.severity,
      };

      console.info(
        "token: ",
        token,
        "\nreport: \n",
        JSON.stringify(data, null, 2)
      );

      // Adiciona os outros dados do relatório

      if (typeof report.image === "string") {
        // Extrai o nome do arquivo a partir da URI
        const filename = report.image.substring(
          report.image.lastIndexOf("/") + 1
        );
        const ext = filename.split(".")[1];

        formData.append("data", JSON.stringify(data));
        // Adiciona a imagem ao FormData
        formData.append("file", {
          uri: report.image, // Caminho do arquivo
          name: filename, // Nome do arquivo
          type: `image/${ext}`, // Tipo MIME baseado na extensão
        } as any);
      } else {
        throw new Error("No valid image provided.");
      }
      console.log("formData:", formData);
      // Envia os dados para o Xano
      const response = await axios.post(
        `${process.env.EXPO_BASE_URL}/report`,
        formData,
        {
          headers: {
            Accept: "application/json", // Aceitar resposta em JSON
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Tipo de conteúdo para envio de arquivo
          },
        }
      );
      console.log(response.data);

      console.log("Report salvo [DATABASE]");
      return true;
    } catch (error: any) {
      {
        console.error(
          "Erro ao enviar relatório:",
          error.response?.data || error.message
        );
      }
      return false;
    }
  };
  const submitReport = async (report: Report) => {
    const netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      // tentar enviar pro banco.
      if (await submit(report)) {
        report.submit = true;
        updateReport(report);
      }
    }
  };
  const sendPendingReports = async () => {
    const netInfo = await NetInfo.fetch();

    if (netInfo.isConnected) {
      try {
        for (const report of reports) {
          if (!report.submit) {
            await submitReport(report);
          }
        }
      } catch (error) {
        console.error("[sendPeding]Erro na requisição POST:", error);
      }
    } else {
      console.error("Sem conexão com a internet. Tente novamente mais tarde.");
      // Aqui você pode salvar o report localmente para enviar depois
    }
  };
  const [connect, setConnect] = useState<boolean>(false);
  useEffect(() => {
    const handleConnectionChange = async (state: NetInfoState) => {
      setConnect(state.isConnected === true);
    };

    const unsubscribe = NetInfo.addEventListener(handleConnectionChange);

    return () => unsubscribe(); // Função de limpeza correta
  }, []);

  useEffect(() => {
    if (connect) {
      console.info("está Conectado a internet!");
      sendPendingReports();
    }
  }, [connect]);

  return {
    submitReport,
    saveReport,
    updateReport,
    clearAllStorage,
    removeReport,
  };
};

export default useSyncReports;
