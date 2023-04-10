import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import TabsNav from "./TabsNav";
import { Ionicons } from "@expo/vector-icons";
import MessagesNav from "./MessagesNav";
import { useColorScheme } from "react-native";
import Notifications from "../screens/Notifications";
import AddFeed from "../screens/Feed/AddFeed";
import AddGroup from "../screens/Group/AddGroup";
import EditGroup from "../screens/Group/EditGroup";
import GroupNav from "../screens/Group/GroupNav";
import JoinConfirm from "../screens/Group/JoinConfirm";
import ActiveArea from "../screens/Map/ActiveArea";
import { GroupUsers } from "../screens/Group/GroupUsers";
import AddTutor from "../screens/Tutor/AddTutor";
import TutorGroup from "../screens/Tutor/TutorGroup";
import MyProfile from "../screens/Profile/MyProfile";
import AddInquiry from "../screens/Tutor/AddInquiry";
import LoggedOutNav from "./LoggedOutNav";

const Stack = createStackNavigator();

export default function LoggedInNav() {
  const isDark = useColorScheme() === "dark";
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        options={{ headerShown: false }}
        component={TabsNav}
      />
      <Stack.Screen
        name={"Notifications"}
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "알림",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={Notifications}
      />
      <Stack.Screen
        name="Messages"
        options={{ headerShown: false }}
        component={MessagesNav}
      />
      <Stack.Screen
        name="AddFeed"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "피드추가",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={AddFeed}
      />
      <Stack.Screen
        name="Profile"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        getComponent={() => require("../screens/Profile/Profile").default}
      />
      <Stack.Screen
        name="AddGroup"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "그룹 만들기",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={AddGroup}
      />

      <Stack.Screen
        name="JoinConfirm"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "가입 신청 확인",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={JoinConfirm}
      />
      <Stack.Screen
        name="EditGroup"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "그룹 정보 수정",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={EditGroup}
      />
      <Stack.Screen
        name="ActiveArea"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "활동 지역 설정",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={ActiveArea}
      />
      <Stack.Screen name="GroupUsers" component={GroupUsers} />
      <Stack.Screen
        name="AddTutor"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "튜터 신청하기",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        initialParams={{
          sidoName: undefined,
          gusiName: undefined,
          dongEubMyunName: undefined,
          riName: undefined,
          roadName: undefined,
          buildingNumber: undefined,
          address: undefined,
          addrRoad: undefined,
          activeArea: undefined,
          areaLatitude: undefined,
          areaLongitude: undefined,
          zipcode: undefined,
        }}
        component={AddTutor}
      />
      <Stack.Screen
        name="AddInquiry"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={AddInquiry}
      />
      <Stack.Screen
        name="LoggedOutNav"
        options={{
          headerBackTitleVisible: false,
          headerBackImage: ({ tintColor }) => (
            <Ionicons color={tintColor} name="close" size={28} />
          ),
          title: "로그인",
          headerTintColor: isDark ? "#ffffff" : "#1e272e",
          headerStyle: {
            backgroundColor: isDark ? "#1e272e" : "#ffffff",
          },
        }}
        component={LoggedOutNav}
      />
    </Stack.Navigator>
  );
}
