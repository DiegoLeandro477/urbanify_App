import React from "react";
import { View, Image, Pressable } from "react-native";
import useAuth from "@//hooks/useAuth";
import { styles } from "./styles";

export default function Header() {
  const { singOut } = useAuth();
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{ width: 200, height: 80, marginTop: 10 }}
          source={require("../../../assets/icons/logoUrbanify700x.png")}
        />
      </View>
      <Pressable style={styles.buttonSingOut} onLongPress={() => singOut()}>
        <Image source={require("../../../assets/icons/ButtonClose.png")} />
      </Pressable>
    </View>
  );
}
