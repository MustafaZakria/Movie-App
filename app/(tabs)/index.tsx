import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-5xl color-primary">Welcome!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  example: {},
});
