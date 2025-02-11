import { useEffect, useState } from "react";
import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Report } from "../components/homeComponents/ReportInterface";
import axios from "axios";
import eventBus from "@//utils/eventBus";
import useAuth from "./useAuth";
import * as Location from "expo-location";

export interface tokenDecoded {
  exp: number;
  iat: number;
  id: { S: string };
  role: { S: string };
}

const useSyncReports = () => {
  const { setDec } = useAuth();
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

  const createReport = async (severity: string, photo: string) => {
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
      coodenates: null, // Placeholder para localização
      subregion: null,
      street: null,
      district: null,
      severity: severity,
      submit: false,
      image: photo!,
      date: formattedDate,
    };

    saveReport(newReport);
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
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        };

        break;
      } catch (error) {
        console.warn("Tentando obter localização");

        // Se a primeira tentativa falhar, aguarda 5 segundos e tenta novamente
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Atraso de 5 segundos
      }

      attempts++;
    }
    await updateReport(newReport);
    submit(newReport);
  };

  const removeReport = async (report: Report) => {
    try {
      const reports = await getReports();
      // Filtra removendo o report com o ID correspondente
      const updatedReports = reports.filter((r: Report) => r.id !== report.id);

      if (updateReport.length !== reports.length) {
        console.log("Report removido [OFF_REPORTS]");
        await setReports(reports);
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
      console.info("[STORAGE] Report atualizado!");
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
    } catch (error) {
      console.error("Erro ao salvar report [STORAGE]:", error);
    }
  };
  const submit = async (report: Report) => {
    try {
      console.log("Enviando Report");
      const formData = new FormData();
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      const decode = setDec(token);
      if (!decode) return;
      const data = {
        user_id: decode.id.S,
        coordinates: {
          latitude: report.coodenates?.latitude,
          longitude: report.coodenates?.longitude,
        },
        subregion: report.subregion,
        district: report.district,
        street: report.street,
        severity: report.severity,
      };

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

      // Envia os dados para o Xano
      const response = await axios.post(
        `${process.env.EXPO_PUBLIC_API_URL}/report`,
        formData,
        {
          headers: {
            Accept: "application/json", // Aceitar resposta em JSON
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // Tipo de conteúdo para envio de arquivo
          },
        }
      );
      console.log("[DATABASE] Report salvo ");
      report.submit = true;
      await updateReport(report);
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
  const sendReports = async () => {
    try {
      const reports = await getReports();
      if (!reports) return;
      const reportsOffline = reports.filter(
        (rep: Report) => rep.submit === false
      );
      if (reportsOffline.length > 0)
        console.log(`Reports OFF>>[${reportsOffline.length}]`);
      for (const report of reports) {
        if (!report.submit) await submit(report);
      }
    } catch (error) {
      console.error("[sendPeding]Erro na requisição POST:", error);
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
      console.info("está conectado a internet!");
      sendReports();
    }
  }, [connect]);

  return {
    clearAllStorage,
    createReport,
  };
};

export default useSyncReports;
