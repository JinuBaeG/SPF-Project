import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Image } from "react-native";
import Comments from "../screens/Comments";
import Feed from "../screens/Feed";
import MyProfile from "../screens/MyProfile";
import Notifications from "../screens/Notifications";
import Photo from "../screens/Photo";
import Search from "../screens/Search";

interface IStackNavFactoryProps {
  screenName: string;
}

const Stack = createStackNavigator();

export default function StackNavFactroy({ screenName }: IStackNavFactoryProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: "screen",
        headerBackTitleVisible: false,
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "black",
          borderBottomColor: "rgba(255,255,255,0.5)",
        },
      }}
    >
      {screenName === "Feed" ? (
        <Stack.Screen
          name={"TabFeed"}
          component={Feed}
          options={{
            headerTitle: () => (
              <Image
                style={{
                  width: 120,
                  height: 40,
                }}
                resizeMode="contain"
                source={require("../assets/white_logo.png")}
              />
            ),
          }}
        />
      ) : null}
      {screenName === "Search" ? (
        <Stack.Screen name={"TabSearch"} component={Search} />
      ) : null}
      {screenName === "Notifications" ? (
        <Stack.Screen name={"TabNotifications"} component={Notifications} />
      ) : null}
      {screenName === "MyProfile" ? (
        <Stack.Screen name={"My Profile"} component={MyProfile} />
      ) : null}
      <Stack.Screen
        name="Profile"
        getComponent={() => require("../screens/Profile").default}
      />
      <Stack.Screen name="Photo" component={Photo} />
      <Stack.Screen
        name="Likes"
        getComponent={() => require("../screens/Likes").default}
      />
      <Stack.Screen name="Comments" component={Comments} />
    </Stack.Navigator>
  );
}
