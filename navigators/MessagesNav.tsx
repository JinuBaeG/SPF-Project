import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import RoomList from "../screens/RoomList";
import Room from "../screens/Room";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function MessagesNav() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: "white",
        headerBackTitleVisible: false,
        headerStyle: {
          backgroundColor: "black",
        },
      }}
    >
      <Stack.Screen
        name="RoomList"
        options={{
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="chevron-down" size={28} />
          ),
        }}
        component={RoomList}
      />
      <Stack.Screen name="Room" component={Room} />
    </Stack.Navigator>
  );
}
