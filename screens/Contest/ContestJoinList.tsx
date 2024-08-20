import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { useEffect, useState } from "react";
import VirtualizedView from "../../components/shared/VirtualizedView";
import { Alert, FlatList } from "react-native";
import ContestListRowByUserId from "../../components/contest/ContestListRowByUserId";
import { isLoggedInVar } from "../../apollo";

const SEE_CONTEST_BY_USER_ID = gql`
  query seeContestByUserId($userId: String) {
    seeContestByUserId(userId: $userId) {
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
      contestUser {
        id
      }
    }
  }
`;

export default function ContestJoinList({ navigation, route }: any) {
  const isLoggedIn = useReactiveVar(isLoggedInVar);

  const { data: contestData } = useQuery(SEE_CONTEST_BY_USER_ID, {
    variables: {
      userId: route.params.userId,
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });
  const renderIcon = ({ item: contest, index }: any) => {
    return <ContestListRowByUserId {...contest} />;
  };
  useEffect(() => {
    navigation.setOptions({
      title: "참가대회목록",
    });
    if (!isLoggedIn) {
      Alert.alert("로그인 후 이용가능합니다.", "", [
        { text: "확인", onPress: () => navigation.goBack() },
      ]);
    }
  }, []);
  return (
    <VirtualizedView>
      <FlatList
        style={{
          width: "100%",
          padding: 16,
        }}
        data={contestData?.seeContestByUserId}
        keyExtractor={(contest: any) => "" + contest.id}
        renderItem={renderIcon}
        initialNumToRender={8}
      />
    </VirtualizedView>
  );
}
