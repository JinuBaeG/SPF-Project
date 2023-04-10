import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect } from "react";
import { useColorScheme } from "react-native";
import styled from "styled-components/native";
import HeaderNav from "../components/nav/HeaderNav";
import ScreenLayout from "../components/ScreenLayout";
import Facility from "../screens/Facility/Facility";
import Tutor from "../screens/Tutor/Tutor";

const Tab = createMaterialTopTabNavigator();

const Container = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-top: 1px;
`;

export function TutorFacilityNav({ navigation }: any) {
  const isDark = useColorScheme() === "dark";

  const MessageButton = () => {
    return <HeaderNav navigation={navigation} />;
  };
  useEffect(() => {
    navigation.setOptions({
      title: "튜터/시설",
      headerRight: MessageButton,
    });
  }, []);

  return (
    <ScreenLayout>
      <Container>
        <Tab.Navigator
          tabBarPosition="top"
          screenOptions={{
            tabBarStyle: {
              backgroundColor: isDark ? "#1e272e" : "#ffffff",
            },
            tabBarActiveTintColor: isDark ? "#ffffff" : "#1e272e",
            tabBarIndicatorStyle: {
              backgroundColor: "#01aa73",
            },
          }}
        >
          <Tab.Screen
            name="Tutor"
            options={{
              title: "튜터",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            component={Tutor}
          />
          <Tab.Screen
            name="Facility"
            options={{
              title: "시설",
              tabBarActiveTintColor: "#01aa73",
              tabBarInactiveTintColor: "rgba(136, 136, 136, 0.4)",
            }}
            component={Facility}
          />
        </Tab.Navigator>
      </Container>
    </ScreenLayout>
  );
}
