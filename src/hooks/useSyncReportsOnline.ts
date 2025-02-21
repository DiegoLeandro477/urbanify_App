import * as SecureStore from "expo-secure-store";
import { Report } from "../components/homeComponents/ReportInterface";
import axios from "axios";
import useSyncReportsOffline from "./useSyncReportsOffline";
import { SeverityEnum } from "@//constants/SeverityEnum";
import { StatusEnum } from "@//constants/statusEnum";

const useSyncReportsOnline = () => {
  const { removeReportOffline, saveReportOffilne } = useSyncReportsOffline();

  const getReportOnline = async (report: Report) => {
    let status = null;
    try {
      console.log(`Obtendo dados do Report: id->[${report.id}]`);

      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      const url = `${process.env.EXPO_PUBLIC_API_URL}/report/status/address/${report.address}/geohash/${report.geohash}`;
    
      console.log("Enviando requisição para:", url);
  
      // Envia os dados para o Xano
      const response = await axios.get(url,
        {
          headers: {
            Accept: "application/json", // Aceitar resposta em JSON
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Tipo de conteúdo para envio de arquivo
          },
        }
      );

      console.log(StatusEnum[response.data.status]);
      status = response.data.status
    } catch (error) {
      console.error("[DATABASE] error: ", error);
    } finally {
      return status;
    }
  };

  const saveReportOnline = async (report: Report) => {
    try {
      console.log("Enviando Report");
      const formData = new FormData();
      const token = await SecureStore.getItemAsync("authToken");
      if (!token) return;

      const data = {
        coordinates: {
          latitude: report.coodenates?.latitude,
          longitude: report.coodenates?.longitude,
        },
        subregion: report.subregion,
        district: report.district,
        street: report.street,
        severity: SeverityEnum[report.severity],
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
      const newReport = report;
      await removeReportOffline(report.id);
      newReport.submit = true;
      newReport.id = response.data.report.id;
      newReport.address = response.data.report.address;
      newReport.geohash = response.data.report.geohash;
      await saveReportOffilne(newReport);
      console.log(response.data);
      return true;
    } catch (error: any) {
      {
        console.info(`HTTP Status: ${error.response.status || undefined}`);
        console.error(
          "Erro ao enviar relatório:",
          error.response?.data || error.message
        );
      }
    }
  };  

  return {
    saveReportOnline,
    getReportOnline,
  };
};

export default useSyncReportsOnline;
