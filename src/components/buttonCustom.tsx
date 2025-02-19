import React from "react";
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../styles/global";

interface ButtonCustomProps {
  gradientColors?: [string, string, ...string[]];
  onPress: () => void;
  title: {
    value?: string;
    color?: string;
  };
  styleCustom?: ViewStyle[] | ViewStyle;
}

const ButtonCustom: React.FC<ButtonCustomProps> = ({
  gradientColors = [colors.p1, colors.p5],
  onPress,
  title = { color: colors.c12 },
  styleCustom = {},
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={{ width: "100%" }}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.button, styleCustom]}
      >
        <Text style={[styles.text, { color: title.color }]}>{title.value}</Text>
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
