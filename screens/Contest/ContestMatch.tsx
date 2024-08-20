import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import VirtualizedView from "../../components/shared/VirtualizedView";
import ContestSortation from "../../components/contest/ContestSortation";
import { Alert, FlatList } from "react-native";
import ContestListRow from "../../components/contest/ContestListRow";

const SEE_CONTEST_TIER_GROUP = gql`
  query seeContestTierGroup(
    $contestId: String
    $sportsSort: String
    $groupSort: String
  ) {
    seeContestTierGroup(
      contestId: $contestId
      sportsSort: $sportsSort
      groupSort: $groupSort
    ) {
      id
      groupName
      roundAdvance
      startRound
      createMatchYN
    }
  }
`;

const ContestMatchContainer = styled.SafeAreaView``;

const ContestTier = styled.TouchableOpacity`
  padding: 8px;
  border-radius: 8px;
`;

const ContestTierText = styled.Text``;

export default function ContestMatch({ navigation, route }: any) {
  const [sportsSort, setSportsSort] = useState("전체");
  const [groupSort, setGroupSort] = useState("전체");

  const { data: contestTierGroup } = useQuery(SEE_CONTEST_TIER_GROUP, {
    variables: {
      contestId: route.params.contestId,
      sportsSort,
      groupSort,
    },
  });

  useEffect(() => {
    navigation.setOptions({
      title: "대진표",
    });
  }, []);

  const renderIcon = ({ item: contest, index }: any) => {
    return (
      <ContestTier
        onPress={() => {
          if (contest.createMatchYN) {
            navigation.navigate("ContestGroupMatchNav", {
              contestId: route.params.contestId,
              contestGroupName: contest.groupName,
              contestGroupId: contest.id,
              startRound: contest.startRound,
              roundAdvance: contest.roundAdvance,
              createMatchYN: contest.createMatchYN,
            });
          } else {
            Alert.alert("아직 조편성이 완료가 되지 않았습니다.");
          }
        }}
        style={{
          backgroundColor: "#fff",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.25,
          shadowRadius: 1,
        }}
      >
        <ContestTierText>{contest.groupName}</ContestTierText>
      </ContestTier>
    );
  };

  return (
    <ScreenLayout>
      <ContestMatchContainer>
        <ContestSortation
          contestId={route.params.contestId}
          setSportsSort={setSportsSort}
          sportsSort={sportsSort}
          setGroupSort={setGroupSort}
          groupSort={groupSort}
        />
        <FlatList
          style={{
            width: "100%",
            padding: 16,
          }}
          data={contestTierGroup?.seeContestTierGroup}
          keyExtractor={(contest: any) => "" + contest.id}
          renderItem={renderIcon}
          initialNumToRender={8}
        />
      </ContestMatchContainer>
    </ScreenLayout>
  );
}
