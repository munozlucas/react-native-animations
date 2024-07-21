import { Link } from "expo-router";
import { StyleSheet, Image, Platform, View } from "react-native";

export default function TabTwoScreen() {
  return (
    <View style={styles.box}>
      <Link href="/square-bouncing">square bouncing</Link>
      <Link href="/pan-gesture">pan gesture</Link>
      <Link href="/spacial-tap">spacial-tap</Link>
      <Link href="/parallax">spacial-tap</Link>
      <Link href="/game">game</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    padding: 20,
    paddingTop: 40,
  },
});
