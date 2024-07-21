import { StyleSheet, View, Dimensions, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const ScreenWidth = Dimensions.get("window").width;

const screenHeight = Dimensions.get("window").height;
const circleSize = 50;
const projectileSize = 10;
const speed = 2000;

const MaxProjectileTranslation = screenHeight;
const game = () => {
  // only translate x
  const [currentEnemies, setCurrentEnemies] = useState<number[]>([]);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const context = useSharedValue(0);

  const moveCircle = () => {
    const distance = MaxProjectileTranslation;
    const duration = (distance / speed) * 1000;
    translateY.value = withTiming(
      distance,
      {
        duration: duration,
      },
      () => {
        translateY.value = withDelay(
          duration,
          withTiming(0, {
            duration: 0,
          })
        );
      }
    );
  };

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  }, []);

  const projectileStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: -translateY.value,
        },
      ],
    };
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      context.value = translateX.value;
    })
    .onUpdate(({ translationX }) => {
      const translatedValue = translationX + context.value;
      const maxTranslation = ScreenWidth / 2;
      const currentDistanceToMax = Math.abs(translatedValue) + circleSize / 2;
      if (currentDistanceToMax > maxTranslation) {
        return;
      }

      translateX.value = withSpring(translatedValue, {
        stiffness: 1000,
        damping: 100,
        mass: 1,
      });
    });

  const Projectile = ({ applyAnimation = false }) => {
    const styles = [
      {
        height: projectileSize,
        width: projectileSize,
        backgroundColor: "red",
        position: "absolute",
        top: (circleSize - projectileSize) / 2,
        left: (circleSize - projectileSize) / 2,
        borderRadius: projectileSize / 2,
        zIndex: 0,
      },
    ];
    if (applyAnimation) {
      styles.push(projectileStyle);
    }
    console.log("applyAnimation", applyAnimation);
    return <Animated.View style={styles} />;
  };

  const projectiles = [1].map((i) => {
    return <Projectile key={i} applyAnimation={i === 1} />;
  });

  const Enemy = ({ applyAnimation = false, value = 0 }) => {
    const translateY = useSharedValue(0);

    useEffect(() => {
      const distance = screenHeight;
      const duration = (distance / speed) * 10 * 1000;
      const interval = setInterval(() => {
        const random = Math.floor(Math.random() * 7);

        if (random === value) {
          translateY.value = withTiming(
            distance,
            {
              duration: duration,
            },
            () => {
              translateY.value = withDelay(
                duration,
                withTiming(0, {
                  duration: 0,
                })
              );
            }
          );
        }
      }, duration);
      return () => clearInterval(interval);
    }, []);

    const enemiesStyle = useAnimatedStyle(() => {
      return {
        transform: [
          {
            translateY: translateY.value,
          },
        ],
      };
    }, []);

    return (
      <Animated.View
        key={value}
        style={[
          {
            flex: 1,
            width: circleSize,
            height: circleSize,
            backgroundColor: "blue",
          },
          enemiesStyle,
        ]}
      />
    );
  };

  return (
    <GestureDetector gesture={panGesture}>
      <Pressable
        onPress={moveCircle}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
        }}
      >
        <View
          style={{
            position: "absolute",
            top: 50,
            flexDirection: "row",
            gap: 2,
          }}
        >
          {[...Array(8).keys()].map((_, i) => (
            <Enemy value={i} />
          ))}
        </View>
        <Animated.View
          style={[
            {
              height: circleSize,
              width: circleSize,
              backgroundColor: "#000",
              position: "absolute",
              bottom: 20,
              borderRadius: circleSize / 2,
              zIndex: 1,
            },
            rStyle,
          ]}
        >
          {projectiles}
        </Animated.View>
      </Pressable>
    </GestureDetector>
  );
};

export default game;

const styles = StyleSheet.create({});
