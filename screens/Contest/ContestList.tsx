import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import VirtualizedView from "../../components/shared/VirtualizedView";
import ContestMonthSearch from "../../components/contest/ContestMonthSearch";
import { FlatList } from "react-native";
import ContestListRow from "../../components/contest/ContestListRow";

const SEE_CONTESTS_BY_DATE = gql`
  query seeContestsByDate($date: String, $offset: Int) {
    seeContestsByDate(date: $date, offset: $offset) {
      id
      contestId
      contestName
      contestPlace
      contestStadium
      contestStartDate
      contestSports
      contestEndDate
      contestRecruitStart
      contestRecruitEnd
    }
  }
`;

export default function ContestList({ navigation }: any) {
  const [date, setDate] = useState<string>();
  const {
    data: contestData,
    refetch,
    fetchMore,
  } = useQuery(SEE_CONTESTS_BY_DATE, {
    variables: {
      date,
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const renderIcon = ({ item: contest, index }: any) => {
    return <ContestListRow {...contest} />;
  };
  useEffect(() => {
    navigation.setOptions({
      title: "대회목록",
    });
  }, []);
  return (
    <VirtualizedView
      onEndReachedThreshold={0.5}
      onEndReached={() =>
        fetchMore({
          variables: {
            offset: contestData?.seeContestsByDate?.length,
            date,
          },
        })
      }
      refreshing={refreshing}
      onRefresh={refresh}
    >
      <ContestMonthSearch date={date} setDate={setDate} />
      <FlatList
        style={{
          width: "100%",
          padding: 16,
        }}
        data={contestData?.seeContestsByDate}
        keyExtractor={(contest: any) => "" + contest.id}
        renderItem={renderIcon}
        initialNumToRender={8}
      />
    </VirtualizedView>
  );
}
