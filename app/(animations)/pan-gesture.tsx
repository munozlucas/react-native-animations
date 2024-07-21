import { StyleSheet, View, TouchableOpacity } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const SquareSize = 120;

function SquareBouncing() {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const context = useSharedValue({ x: 0, y: 0 });
  const isDragging = useSharedValue(false);

  const rotate = useDerivedValue(() => {
    return withSpring(isDragging.value ? `45deg` : "0deg");
  }, []);

  const scale = useDerivedValue(() => {
    return withSpring(isDragging.value ? 0.9 : 1);
  });

  const color = useDerivedValue(() => {
    if (isDragging.value) {
      return "#00a6ff";
    }
    const isInWhiteArea = translateY.value < 0;
    const isInBlackArea = translateY.value > 0;
    if (isInWhiteArea) {
      return "black";
    }
    if (isInBlackArea) {
      return "white";
    }
    return "#00a6ff";
  });

  const animatedColor = useDerivedValue(() => {
    return withTiming(color.value);
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
        {
          rotate: rotate.value,
        },
        {
          scale: scale.value,
        },
      ],
      backgroundColor: animatedColor.value,
    };
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
      context.value = { x: translateX.value, y: translateY.value };
    })
    .onUpdate(({ translationX, translationY }) => {
      translateX.value = translationX + context.value.x;
      translateY.value = translationY + context.value.y;
    })
    .onFinalize(() => {
      isDragging.value = false;
    });
  return (
    <View style={styles.container}>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.square, rStyle]} />
      </GestureDetector>
      <View style={styles.background} />
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
  background: {
    position: "absolute",
    top: "50%",
    left: 0,
    height: "50%",
    width: "100%",
    backgroundColor: "#000",
    zIndex: -1,
  },
});

export default SquareBouncing;
