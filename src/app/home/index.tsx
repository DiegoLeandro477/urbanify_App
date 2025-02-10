import React, { useEffect, useState } from "react";
import ModalSelectedInfo from "@//components/homeComponents/modalSelectedInfo";
import { Ionicons } from "@expo/vector-icons";
import ButtonCustom from "@//components/buttonCustom";
import { ClassColor, colors, Font } from "@//styles/global";
import * as Location from "expo-location";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Report } from "@//components/homeComponents/ReportInterface";
import ConfirmDeleteModal from "@//components/homeComponents/confirmeDeleteModal";
import useSyncReports from "@//hooks/useSyncReports";
import { useReports } from "@//hooks/useReports";
import styles from "./styles";
import useCapture from "@//hooks/useCapture";
import { router, UnknownInputParams } from "expo-router";
import useProtectedRoute from "../middlewares/middleware";

const Home = () => {
  useProtectedRoute(); // Proteção de rotas
  const { submitReport, saveReport, updateReport, clearAllStorage } =
    useSyncReports();
  const { photo, handleCapture, setPhoto } = useCapture(); // Controle da Câmera
  const { reports, loadReports } = useReports(); // Pega a lista de reports monitorada
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
    if (!severity) return;

    if (!photo) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });

    let counter = 0; // You can store this in a ref or state to persist across renders

    // Cria um novo relatório com a foto capturada
    const newReport: Report = {
      id: Math.round(
        Date.now() / Math.floor(Math.random() * (1000 + 1))
      ).toString(), // Gera um novo ID
      location: null, // Placeholder para localização
      street: "",
      district: "",
      severity: severity,
      submit: false,
      image: photo,
      date: formattedDate,
    };
    setSelectedItem(null);
    setPhoto(null);

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
        newReport.location = {
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
    await submitReport(newReport);
  };

  const deleteItem = (item: Report) => {
    if (!item) {
      alert("Sem item selecionado");
      return;
    }
  };
  // Renderiza um item da lista de reports
  const renderReport = ({ item }: { item: Report }) => (
    <TouchableOpacity
      onLongPress={() =>
        router.push({
          pathname: "/reportDetails",
          params: item as unknown as UnknownInputParams,
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

        {!item.location && (
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
              item.severity === "moderado"
                ? styles.severityModerado
                : styles.severityGrave,
            ]}
          >
            {item.severity}
          </Text>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[Font.xs, ClassColor.c5]}>{item.date}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
          <ButtonCustom
            title={{ value: "ENVIAR", color: "#fff" }}
            onPress={handleCapture}
          />
        </View>
        <View>
          {/* Lista de reports recentes */}
          <Text style={[styles.reportsTitle, Font.l, ClassColor.c2]}>
            Histórico de Ocorrências
          </Text>
          <FlatList
            style={styles.fletListOut}
            data={reports}
            renderItem={renderReport}
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
