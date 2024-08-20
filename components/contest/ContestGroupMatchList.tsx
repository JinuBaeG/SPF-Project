import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { FlatList } from "react-native";
import styled from "styled-components/native";

const SEE_CONTEST_MATCH_GROUP_RESULT = gql`
  query seeContestGroupMatchResult($contestMatchGroupId: String) {
    seeContestGroupMatchResult(contestMatchGroupId: $contestMatchGroupId) {
      id
      contest {
        id
      }
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
      }
      totalWin
      totalLose
      totalWinScore
      totalLoseScore
      totalScore
    }
  }
`;

const GroupMatchList = styled.TouchableOpacity`
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 8px;
`;

const GroupNo = styled.View``;

const GroupNoText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ContestTeam = styled.View`
  margin: 4px 0;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #ccc;
  flex-direction: row;
  justify-content: space-between;
`;

const ContestTeamName = styled.Text``;

const ContestTeamScore = styled.Text``;

const ContestTeamText = styled.Text<{ score: string }>`
  color: ${(props) => props.score};
`;

export default function ContestGroupMatchList(contest: any) {
  const navigation = useNavigation<any>();

  const { data: contestMatchResult } = useQuery(
    SEE_CONTEST_MATCH_GROUP_RESULT,
    {
      variables: { contestMatchGroupId: contest.id },
      fetchPolicy: "network-only",
    }
  );

  return (
    <GroupMatchList
      onPress={() => {
        navigation.navigate("ContestMatchDetail", {
          groupMatchId: contest.id,
          groupNo: contest.groupNo,
        });
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
      <GroupNo>
        <GroupNoText>{contest.groupNo}조</GroupNoText>
        <FlatList
          style={{
            width: "100%",
          }}
          data={contestMatchResult?.seeContestGroupMatchResult}
          keyExtractor={(team: any) => "" + team.id}
          renderItem={({ item: team }: any) => {
            return (
              <ContestTeam>
                <ContestTeamName>{team.contestTeam.teamName}</ContestTeamName>
                <ContestTeamScore>
                  {team.totalWin}승 {team.totalLose}패{" "}
                  <ContestTeamText
                    score={
                      team.totalScore > 0
                        ? "red"
                        : team.totalScore < 0
                        ? "blue"
                        : "gray"
                    }
                  >
                    {team.totalScore}
                  </ContestTeamText>
                </ContestTeamScore>
              </ContestTeam>
            );
          }}
        />
      </GroupNo>
    </GroupMatchList>
  );
}
