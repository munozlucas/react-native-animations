import { Slot } from "expo-router";

export default function AnimationsLayout() {
  return (
    <Slot
      screenOptions={{
        headerShown: false,
      }}
    />
  );
}
