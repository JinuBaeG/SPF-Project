import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { FlatList } from "react-native";
import ContestGroupMatchList from "../../components/contest/ContestGroupMatchList";

const SEE_CONTEST_MATCH_GROUP_LIST = gql`
  query seeContestGroupMatch($contestGroupId: String) {
    seeContestGroupMatch(contestGroupId: $contestGroupId) {
      id
      groupNo
      contestTeam {
        id
        teamName
        contestUser {
          id
          user {
            id
            username
            avatar
          }
        }
        contestGroupMatchResult {
          id
          totalWin
          totalLose
          totalScore
        }
      }
    }
  }
`;

const GroupMatchContainer = styled.SafeAreaView``;

export default function ContestGroupMatch({ navigation, route }: any) {
  const {
    data: groupMatch,
    loading,
    refetch,
  } = useQuery(SEE_CONTEST_MATCH_GROUP_LIST, {
    variables: {
      contestGroupId: route.params.contestGroupId,
    },
    fetchPolicy: "network-only",
  });

  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderGroupList = ({ item: contest }: any) => {
    return <ContestGroupMatchList {...contest} />;
  };

  useEffect(() => {
    navigation.setOptions({
      title: route.params.contestGroupName,
    });
  }, []);

  return (
    <ScreenLayout loading={loading}>
      <GroupMatchContainer>
        <FlatList
          style={{
            width: "100%",
            padding: 16,
          }}
          refreshing={refreshing}
          onRefresh={refresh}
          data={groupMatch?.seeContestGroupMatch}
          keyExtractor={(contest: any) => "" + contest.id}
          renderItem={renderGroupList}
        />
      </GroupMatchContainer>
    </ScreenLayout>
  );
}
