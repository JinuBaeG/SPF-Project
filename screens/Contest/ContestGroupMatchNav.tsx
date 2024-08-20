import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import ContestGroupMatch from "./ContestGroupMatch";
import ContestGroupTournament from "./ContestGroupTournament";

const Tab = createMaterialTopTabNavigator();

const ContestDetailNavContainer = styled.View`
  flex: 1;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-top: 1px;
`;

export default function ContestGroupMatchNav({ navigation, route }: any) {
  const contestId = route.params.contestId;
  const contestGroupName = route.params.contestGroupName;
  const contestGroupId = route.params.contestGroupId;
  const roundAdvance = route.params.roundAdvance;
  const startRound = route.params.startRound;
  const createMatchYN = route.params.createMatchYN;

  useEffect(() => {
    navigation.setOptions({
      title: contestGroupName,
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
          name="ContestGroupMatch"
          options={{
            tabBarLabel: "예선",
            tabBarActiveTintColor: "#01aa73",
            tabBarInactiveTintColor: "#000000",
          }}
          initialParams={{
            contestId,
            contestGroupName,
            contestGroupId,
            roundAdvance,
            createMatchYN,
          }}
          component={ContestGroupMatch}
        />
        <Tab.Screen
          name="ContestGroupTournament"
          options={{
            tabBarLabel: "본선",
            tabBarActiveTintColor: "#01aa73",
            tabBarInactiveTintColor: "#000000",
          }}
          initialParams={{
            contestId,
            contestGroupName,
            contestGroupId,
            roundAdvance,
            startRound,
            createMatchYN,
          }}
          component={ContestGroupTournament}
        />
      </Tab.Navigator>
    </ContestDetailNavContainer>
  );
}
