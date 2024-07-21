import { Dimensions, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Images from "@/constants/Images";
import ListImage from "./ListImage";
import Animated, {
  useAnimatedReaction,
  useAnimatedRef,
  useScrollViewOffset,
} from "react-native-reanimated";

const { width: WindowWidth } = Dimensions.get("window");

const ListImageWidth = WindowWidth * 0.8;
const InternalPadding = 10;
const ItemContainerWidth = ListImageWidth + InternalPadding * 2;

const ListPadding = (WindowWidth - ListImageWidth) / 2;

const Parallax = () => {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();

  const scrollOffset = useScrollViewOffset(scrollRef);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        horizontal
        contentContainerStyle={{
          alignItems: "center",
          paddingLeft: ListPadding,
          paddingRight: ListPadding,
        }}
        snapToInterval={ItemContainerWidth}
        pagingEnabled
        decelerationRate="fast"
      >
        {Images.map((imageUri, index) => (
          <ListImage
            index={index}
            scrollOffset={scrollOffset}
            uri={imageUri}
            imageWidth={ListImageWidth}
            itemWidth={ItemContainerWidth}
            style={{
              marginHorizontal: InternalPadding,
            }}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default Parallax;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});
