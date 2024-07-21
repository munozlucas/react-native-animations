import { Text, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedReaction,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const CircleRadius = 30;

function SpacialTap() {
  const left = useSharedValue(0);
  const top = useSharedValue(0);
  const scale = useSharedValue(0);

  const previousLeft = useSharedValue(0);
  const previousTop = useSharedValue(0);

  const tapGesture = Gesture.Tap().onBegin((event) => {
    previousLeft.value = left.value;
    previousTop.value = top.value;
    left.value = event.x;
    top.value = event.y;
  });

  const animatedLeft = useDerivedValue(() => {
    return withTiming(left.value, {
      duration: 1000,
      easing: Easing.inOut(Easing.quad),
    });
  }, []);

  const animatedTop = useDerivedValue(() => {
    return withTiming(top.value, {
      duration: 1000,
      easing: Easing.inOut(Easing.quad),
    });
  }, []);

  const rStyle = useAnimatedStyle(() => {
    return {
      top: top.value - CircleRadius,
      left: left.value - CircleRadius,
      transform: [{ scale: scale.value }],
    };
  }, []);

  const rPreviousStyle = useAnimatedStyle(() => {
    return {
      top: previousTop.value - CircleRadius,
      left: previousLeft.value - CircleRadius,
    };
  }, []);

  const transitionStyle = useAnimatedStyle(() => {
    return {
      top: animatedTop.value - CircleRadius,
      left: animatedLeft.value - CircleRadius,
    };
  }, []);

  useAnimatedReaction(
    () => {
      return left.value;
    },
    (curr, prev) => {
      if (curr !== prev && curr !== 0) {
        cancelAnimation(scale);
        scale.value = 0;
        scale.value = withSpring(1, {
          mass: 0.5,
        });
      }
    }
  );

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={styles.container}>
        <Animated.View style={[styles.baseCircle, rStyle]} />
        <Animated.View style={[styles.baseCircle, rPreviousStyle]} />
        <Animated.View
          style={[
            styles.baseCircle,
            {
              backgroundColor: "#00a6ff",
            },
            transitionStyle,
          ]}
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  baseCircle: {
    width: CircleRadius * 2,
    height: CircleRadius * 2,
    borderRadius: CircleRadius,
    backgroundColor: "#2f2f2f",
    position: "absolute",
  },
});

export default SpacialTap;
