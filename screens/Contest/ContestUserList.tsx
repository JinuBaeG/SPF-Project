import { gql, useQuery } from "@apollo/client";
import React, { useEffect } from "react";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import VirtualizedView from "../../components/shared/VirtualizedView";
import { FlatList } from "react-native";
import ContestTeamList from "../../components/contest/ContestTeamList";

const SEE_CONTEST_USER_LIST = gql`
  query seeContestTeamList($contestId: String) {
    seeContestTeamList(contestId: $contestId) {
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
    }
  }
`;

export default function ContestUserList({ navigation, route }: any) {
  const contestId = route.params.contestId;

  const { data: contestTeamList, loading: contestTeamLoading } = useQuery(
    SEE_CONTEST_USER_LIST,
    {
      variables: {
        contestId,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  useEffect(() => {
    navigation.setOptions({
      title: "참가자 명단",
    });
  }, []);

  const renderTeamList = ({ item: contestTeam, index }: any) => {
    return <ContestTeamList {...contestTeam} />;
  };

  return (
    <ScreenLayout loading={contestTeamLoading}>
      <VirtualizedView>
        <FlatList
          style={{
            width: "100%",
            padding: 16,
          }}
          data={contestTeamList?.seeContestTeamList}
          keyExtractor={(contest: any) => "" + contest.id}
          renderItem={renderTeamList}
          initialNumToRender={6}
        />
      </VirtualizedView>
    </ScreenLayout>
  );
}
