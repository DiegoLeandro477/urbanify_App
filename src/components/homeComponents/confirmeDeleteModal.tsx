import React from "react";
import {
  Modal,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { colors, Font, ClassColor } from "@//styles/global";
import { Report } from "./ReportInterface";

interface ConfirmDeleteModalInterface {
  visible: boolean;
  onClose: () => void;
  onConfirm: (item: Report) => void;
  itemDelete: Report | null;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalInterface> = ({
  visible,
  onClose,
  onConfirm,
  itemDelete,
}) => {
  const confirm = () => {
    onConfirm(itemDelete!);
    onClose();
  };
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Image
              source={require("../../../assets/icons/trash-can.png")}
              style={styles.icon}
            />
            <TouchableOpacity onPress={() => onClose()}>
              <Image
                source={require("../../../assets/icons/ButtonClose.png")}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[Font.l, ClassColor.c2]}>Deletar ocorrência?</Text>
            <Text style={[Font.s, ClassColor.c4]}>
              Tem certeza de que deseja excluir? Esta ação não pode ser
              desfeita.
            </Text>
          </View>

          <View style={styles.buttons}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => onClose()}
            >
              <Text style={[Font.m_b, ClassColor.c4]}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={confirm}>
              <Text style={[Font.m_b, ClassColor.c12]}>Deletar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modal: {
    backgroundColor: colors.c12,
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  header: {
    flexDirection: "row", // Alinha os ícones na horizontal
    justifyContent: "space-between", // Espaço entre os ícones
    width: "100%", // Garante que ocupe toda a largura do modal
    paddingBottom: 10, // Ajusta o espaçamento inferior para os ícones
  },
  icon: {
    width: 48, // Define o tamanho dos ícones
    height: 48, // Define o tamanho dos ícones
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  message: {
    marginVertical: 10,
    fontSize: 16,
    textAlign: "center",
  },
  buttons: {
    flexDirection: "row",
    marginTop: 20,
  },
  cancelButton: {
    width: "50%",
    borderWidth: 1,
    borderColor: colors.c0,
    padding: 10,
    marginRight: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmButton: {
    width: "50%",
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ConfirmDeleteModal;
