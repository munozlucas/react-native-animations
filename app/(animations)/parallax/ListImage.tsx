import { StyleProp, ViewStyle, Dimensions } from "react-native";
import React from "react";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

const { width: ScreenWidth } = Dimensions.get("window");

interface ListImageProps {
  uri: string;
  imageWidth: number;
  itemWidth: number;
  style: StyleProp<ViewStyle>;
  scrollOffset: SharedValue<number>;
  index: number;
}
function ListImage({
  uri,
  imageWidth,
  itemWidth,
  style,
  scrollOffset,
  index,
}: ListImageProps) {
  const inputRange = [
    (index - 1) * itemWidth,
    index * itemWidth,
    (index + 1) * itemWidth,
  ];
  const rStyle = useAnimatedStyle(() => {
    const outputRange = [-ScreenWidth / 2, 0, ScreenWidth / 2];
    const translateX = interpolate(scrollOffset.value, inputRange, outputRange);
    return {
      transform: [
        {
          scale: 1.7,
        },
        {
          translateX: translateX,
        },
      ],
    };
  }, []);

  const rContainerStyle = useAnimatedStyle(() => {
    const outputRange = [1, 1.05, 1];
    const scale = interpolate(scrollOffset.value, inputRange, outputRange);
    return {
      transform: [
        {
          scale: scale,
        },
      ],
    };
  }, []);

  return (
    <Animated.View
      key={index}
      style={[
        style,
        {
          overflow: "hidden",
          borderRadius: 20,
        },
        rContainerStyle,
      ]}
    >
      <Animated.Image
        resizeMode={"cover"}
        style={[
          {
            width: imageWidth,
            aspectRatio: 0.6,
          },
          rStyle,
        ]}
        source={{
          uri: uri,
        }}
      />
    </Animated.View>
  );
}

export default ListImage;
