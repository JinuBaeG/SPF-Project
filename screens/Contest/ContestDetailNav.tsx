import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import ContestDetail from "./ContestDetail";
import { gql, useQuery } from "@apollo/client";

const Tab = createMaterialTopTabNavigator();

const ContestDetailNavContainer = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-top: 1px;
`;

export default function ContestDetailNav({ navigation, route }: any) {
  const contestId = route.params.contestId;
  const contestName = route.params.contestName;

  useEffect(() => {
    navigation.setOptions({
      title: contestName,
    });
  }, []);
  return (
    <ContestDetailNavContainer>
      <Tab.Navigator
        tabBarPosition="top"
        screenOptions={{
          tabBarStyle: {
            backgroundColor: "#ffffff",
          },
          tabBarActiveTintColor: "#000000",
          tabBarIndicatorStyle: {
            backgroundColor: "#01aa73",
          },
        }}
      >
        <Tab.Screen
          name="ContestDetail"
          options={{
            title: "상세",
            tabBarActiveTintColor: "#01aa73",
            tabBarInactiveTintColor: "#000000",
          }}
          initialParams={{ contestId, contestName }}
          component={ContestDetail}
        />
      </Tab.Navigator>
    </ContestDetailNavContainer>
  );
}
