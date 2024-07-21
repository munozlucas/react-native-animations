import { StyleSheet, View, TouchableOpacity } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SquareSize = 120;

function SquareBouncing() {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
        { scale: scale.value },
        { rotate: `${rotate.value}deg` },
      ],
    };
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        onTouchStart={() => {
          scale.value = withTiming(1.2);
        }}
        onTouchEnd={() => {
          scale.value = withTiming(1);
          //rotate.value = withRepeat(withTiming(rotate.value + 90), 4, true);
          rotate.value = withTiming(rotate.value + 90);
        }}
        style={[styles.square, rStyle]}
      />
      <TouchableOpacity
        onPress={() => {
          const MaxTranslation = 100;
          // We want to update translation between [-100, 100]
          const tX = Math.random() * MaxTranslation * 2 - MaxTranslation;
          const tY = Math.random() * MaxTranslation * 2 - MaxTranslation;

          translateX.value = withSpring(tX);
          translateY.value = withSpring(tY);
        }}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  square: {
    height: SquareSize,
    width: SquareSize,
    backgroundColor: "#00a6ff",
    borderRadius: 30,
    borderCurve: "continuous",
  },
  button: {
    height: 64,
    width: 64,
    borderRadius: 32,
    backgroundColor: "black",
    position: "absolute",
    bottom: 48,
    right: 32,
  },
});

export default SquareBouncing;
