import React, { useEffect, useState } from "react";
import ModalSelectedInfo from "@//components/homeComponents/modalSelectedInfo";
import { Ionicons } from "@expo/vector-icons";
import ButtonCustom from "@//components/buttonCustom";
import { ClassColor, Font } from "@//styles/global";
import * as Location from "expo-location";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";
import { Report } from "@//components/homeComponents/ReportInterface";
import ConfirmDeleteModal from "@//components/homeComponents/confirmeDeleteModal";
import { useReports } from "@//hooks/useReports";
import styles from "./styles";
import useCapture from "@//hooks/useCapture";
import useProtectedRoute from "../middlewares/middleware";
import RenderReport from "@//components/homeComponents/renderList";
import useSyncReportsOffline from "@//hooks/useSyncReportsOffline";

const Home = () => {
  useProtectedRoute(); // Proteção de rotas
  const { photo, handleCapture, setPhoto } = useCapture(); // Controle da Câmera
  const { reports, loadReports, createReport } = useReports(); // Pega a lista de reports monitorada
  const { clearAllStorage } = useSyncReportsOffline();
  const [confirmDeleteModalVisible, setConfirmDeleteModalVisible] =
    useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<Report | null>(null);
  const [selectedVisibleModal, setSelectedVisibleModal] =
    useState<boolean>(false);
  loadReports();
  // UseEffect para carregar os reports ao iniciar o app
  useEffect(() => {
    if (photo) {
      (async () => {
        try {
          // Solicitar permissão para acessar a localização
          const { status } = await Location.requestForegroundPermissionsAsync();
          if (status !== "granted") {
            Alert.alert(
              "Aviso",
              "precisamos de sua localização para continuar o relato"
            );
            console.log("Permissão para acessar a localização foi negada");
            setPhoto(null);
            return;
          }
          setSelectedVisibleModal(true);
        } catch (error) {
          console.error("Erro ao carregar reports:", error);
        }
      })();
    }
  }, [photo]);
  const handleSeverity = async (severity: string | null) => {
    if (!severity || !photo) return;

    createReport(severity, photo);

    setSelectedItem(null);
    setPhoto(null);
  };

  const deleteItem = (item: Report) => {
    if (!item) {
      alert("Sem item selecionado");
      return;
    }
  };
  return (
    <ScrollView>
      <ModalSelectedInfo
        onCreateReport={handleSeverity}
        onRequestClose={() => setSelectedVisibleModal(false)}
        visible={selectedVisibleModal}
      />
      {/* Modal de confirmação de exclusão */}
      <ConfirmDeleteModal
        visible={confirmDeleteModalVisible}
        onClose={() => setConfirmDeleteModalVisible(false)}
        onConfirm={deleteItem}
        itemDelete={selectedItem}
      />

      <View style={{ padding: 20 }}>
        <View style={{ width: "100%" }}>
          <Text style={[{ marginBottom: 20 }, Font.xl]}>
            Fotografe o local do problema
          </Text>
          <TouchableOpacity style={styles.photoBox} onPress={handleCapture}>
            <Ionicons name="camera-outline" size={48} color="#007BFF" />
            <Text style={styles.photoText}>Fotografe aqui</Text>
          </TouchableOpacity>
          {/* Botão de envio */}
          <ButtonCustom title={"ENVIAR"} onPress={handleCapture} />
        </View>
        <View>
          {/* Lista de reports recentes */}
          <Text style={[styles.reportsTitle, Font.l, ClassColor.c2]}>
            Histórico de Ocorrências
          </Text>
          <FlatList
            style={styles.fletListOut}
            data={reports}
            renderItem={({ item }) => <RenderReport item={item} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.fletListIn}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Home;
