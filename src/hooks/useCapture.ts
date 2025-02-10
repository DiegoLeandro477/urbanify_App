import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

const useCapture = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const handleCapture = async () => {
    // Solicita permissão para acessar a câmera
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermission.granted) {
      Alert.alert("Permissão Negada", "É necessário permitir o uso da câmera.");
      return;
    }

    // Captura a foto
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      base64: false,
      quality: 1,
    });

    // Verifica se a captura não foi cancelada e atribui o URI da imagem
    if (!result.canceled && result.assets && result.assets[0]) {
      setPhoto(result.assets[0].uri); // Salva a foto no estado
      console.log("\n\nImagem capturada: ", result.assets[0].uri);
      return result.assets[0].uri;
    }

    return null;
  };

  return { photo, handleCapture, setPhoto };
};

export default useCapture;
