import {
  View,
  Text,
  BackHandler,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import ButtonCustom from "@//components/buttonCustom";
import styles from "./styles";
import { ClassColor, Font } from "@//styles/global";
import { useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import useAuth from "@//hooks/useAuth";

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    signIn,
    loading,
    errorEmailOrPassword,
  } = useAuth();
  const [securityText, setSecutiryText] = useState<boolean>(false);
  const passwordInputRef = useRef<TextInput>(null); // Referência para o campo de senha

  const handleCancel = () => {
    BackHandler.exitApp();
  };

  // Quando pressionar 'Enter' no campo de email, foca no campo de senha
  const handleEmailSubmit = () => {
    passwordInputRef.current?.focus(); // Foca no campo de senha
  };
  // Quando pressionar 'Enter' no campo de senha, chama a função signIn()
  const handlePasswordSubmit = () => {
    signIn(); // Chama a função de login
  };

  return (
    <View style={styles.view}>
      <View style={styles.container}>
        <Text
          style={[Font.xl, ClassColor.c8, { marginTop: 20, marginBottom: 50 }]}
        >
          [Logo UrbaniFy]
        </Text>
        <View style={styles.viewInput}>
          <Text style={[Font.m, ClassColor.c4]}>Email</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons style={[Font.m, ClassColor.c4]} name="person" size={20} />
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              onSubmitEditing={handleEmailSubmit}
              returnKeyLabel="ir"
            />
          </View>
        </View>
        <View style={styles.viewInput}>
          <Text style={[Font.m, ClassColor.c4]}>Senha</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              style={[Font.m, ClassColor.c4]}
              name="lock-closed"
              size={20}
            />
            <TextInput
              ref={passwordInputRef} // Referência para o campo de senha
              style={styles.textInput}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!securityText}
              onSubmitEditing={handlePasswordSubmit} // Chama signIn ao pressionar Enter no campo de senha
              returnKeyType="done" // Muda a tecla Enter para "Done"
            />
            <Pressable
              style={{ padding: 5 }}
              onPressIn={() => setSecutiryText(!securityText)}
            >
              {password && (
                <Ionicons
                  name={!securityText ? "eye-off-outline" : "eye-outline"}
                  size={24}
                />
              )}
            </Pressable>
          </View>
        </View>
        {errorEmailOrPassword && (
          <View
            style={{
              flexDirection: "row",
              gap: 2,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, .1)",
              borderRadius: 20,
              paddingVertical: 2,
              paddingHorizontal: 10,
              alignSelf: "center",
            }}
          >
            <Ionicons
              style={ClassColor.red}
              name="alert-circle-outline"
              size={16}
            />
            <Text style={[ClassColor.red]}>Usuário ou senha incorreto</Text>
          </View>
        )}

        {/* Loading Spinner */}
        {loading && <ActivityIndicator size="large" color="white" />}

        <ButtonCustom
          styleCustom={{ marginTop: 50, marginBottom: 10 }}
          onPress={() => signIn()}
          title={{ value: "ENTRAR", color: "white" }}
        />

        <ButtonCustom
          onPress={() => handleCancel()} // precisa fechar o app
          title={{ value: "CADASTRAR", color: "white" }}
        />
      </View>
    </View>
  );
};

export default Login;
