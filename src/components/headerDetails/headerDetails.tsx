import React from "react";
import { View, Image, Pressable } from "react-native";
import { styles } from "./styles";

export default function HeaderDetails() {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          style={{ width: 200, height: 80, marginTop: 10 }}
          source={require("../../../assets/icons/logoUrbanify700x.png")}
        />
      </View>
    </View>
  );
}
