import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ClassColor, colors } from "../styles/global";

interface ButtonCustomProps {
  gradientColors?: [string, string, ...string[]];
  onPress: () => void;
  title: string;
  styleCustom?: ViewStyle[] | ViewStyle;
  textCustom?: TextStyle[] | TextStyle;
}

const ButtonCustom: React.FC<ButtonCustomProps> = ({
  gradientColors = [colors.p1, colors.p4],
  onPress,
  title,
  styleCustom = {},
  textCustom = { color: colors.c12 },
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ width: "100%" }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, styleCustom]}
      >
        <Text style={[styles.text, textCustom]}>{title}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
  },
});

export default ButtonCustom;
