import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { useColorScheme } from "react-native";
import Comments from "../screens/Feed/Comments";
import Feed from "../screens/Feed/Feed";
import Group from "../screens/Group/Group";
import Home from "../screens/Home";
import MyProfile from "../screens/Profile/MyProfile";
import Photo from "../screens/Feed/Photo";
import PhotoDetail from "../screens/Feed/PhotoDetail";
import GroupNav from "../screens/Group/GroupNav";
import { TutorFacilityNav } from "./TutorFacilityNav";
import TutorNav from "../screens/Tutor/TutorNav";
import TutorInquiry from "../screens/Tutor/TutorInquiry";
import TutorInquiryDetail from "../screens/Tutor/TutorInquiryDetail";
import TutorInquiryResponse from "../screens/Tutor/TutorInquiryResponse";
import AddBoard from "../screens/Board/AddBoard";
import BoardList from "../screens/Board/BoardList";
import BoardDetail from "../screens/Board/BoardDetail";
import BoardReComments from "../screens/Board/BoardReComments";
import AddNotice from "../screens/Notice/AddNotice";
import NoticeList from "../screens/Notice/NoticeList";
import NoticeDetail from "../screens/Notice/NoticeDetail";
import NoticeReComments from "../screens/Notice/NoticeReComments";
import ReComments from "../screens/Feed/ReComments";
import AdminNoticeDetail from "../screens/Profile/AdminNoticeDetail";
import AdminNotice from "../screens/Profile/AdminNotice";
import AdminFaq from "../screens/Profile/AdminFaq";
import AdminFaqDetail from "../screens/Profile/AdminFaqDetail";

interface IStackNavFactoryProps {
  screenName: string;
}

const Stack = createStackNavigator();

export default function StackNavFactroy({ screenName }: IStackNavFactoryProps) {
  const isDark = useColorScheme() === "dark";

  return (
    <Stack.Navigator
      screenOptions={{
        headerMode: "screen",
        headerBackTitleVisible: false,
        headerTintColor: isDark ? "#ffffff" : "#1e272e",
        headerStyle: {
          backgroundColor: isDark ? "#1e272e" : "#ffffff",
          borderBottomColor: "rgba(255,255,255,0.5)",
        },
      }}
    >
      {screenName === "Home" ? (
        <Stack.Screen name={"TabHome"} component={Home} />
      ) : null}
      {screenName === "Feed" ? (
        <Stack.Screen name={"TabFeed"} component={Feed} />
      ) : null}
      {screenName === "Group" ? (
        <Stack.Screen name={"TabGroup"} component={Group} />
      ) : null}
      {screenName === "Tutor" ? (
        <Stack.Screen name={"TabTutor"} component={TutorFacilityNav} />
      ) : null}
      {screenName === "MyProfile" ? (
        <Stack.Screen name={"My Profile"} component={MyProfile} />
      ) : null}
      <Stack.Screen
        name="Profile"
        getComponent={() => require("../screens/Profile/Profile").default}
      />
      <Stack.Screen name="Photo" component={Photo} />
      <Stack.Screen
        name="Likes"
        getComponent={() => require("../screens/Likes").default}
      />
      <Stack.Screen name="PhotoDetail" component={PhotoDetail} />
      <Stack.Screen name="Comments" component={Comments} />
      <Stack.Screen name="ReComments" component={ReComments} />
      <Stack.Screen name="GroupDetail" component={GroupNav} />
      <Stack.Screen name="TutorDetail" component={TutorNav} />
      <Stack.Screen name="SeeInquiry" component={TutorInquiry} />
      <Stack.Screen name="TutorInquiryDetail" component={TutorInquiryDetail} />
      <Stack.Screen
        name="TutorInquiryResponse"
        component={TutorInquiryResponse}
      />
      <Stack.Screen name="AddBoard" component={AddBoard} />
      <Stack.Screen name="BoardList" component={BoardList} />
      <Stack.Screen name="BoardDetail" component={BoardDetail} />
      <Stack.Screen name="BoardReComments" component={BoardReComments} />
      <Stack.Screen name="AddNotice" component={AddNotice} />
      <Stack.Screen name="NoticeList" component={NoticeList} />
      <Stack.Screen name="NoticeDetail" component={NoticeDetail} />
      <Stack.Screen name="NoticeReComments" component={NoticeReComments} />
      <Stack.Screen name="AdminNotice" component={AdminNotice} />
      <Stack.Screen name="AdminNoticeDetail" component={AdminNoticeDetail} />
      <Stack.Screen name="AdminFaq" component={AdminFaq} />
      <Stack.Screen name="AdminFaqDetail" component={AdminFaqDetail} />
    </Stack.Navigator>
  );
}
