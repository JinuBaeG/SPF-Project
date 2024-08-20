import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";

const SEE_CONTEST_MATCH_GROUP = gql`
  query seeContestMatchTeam($contestMatchGroupId: String) {
    seeContestMatchTeam(contestMatchGroupId: $contestMatchGroupId) {
      id
      teamName
    }
  }
`;

const SEE_CONTEST_MATCH_GROUP_HISTORY = gql`
  query seeContestGroupMatchHistory($contestMatchGroupId: String) {
    seeContestGroupMatchHistory(contestMatchGroupId: $contestMatchGroupId) {
      id
      contest {
        id
      }
      contestTeam {
        id
        teamName
      }
      opponentTeam {
        id
        teamName
      }
      isWinner
      winScore
      loseScore
      resultScore
    }
  }
`;

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

const MatchDetailContainer = styled.View`
  flex: 1;
  background-color: white;
  padding: 16px;
`;

const Title = styled.View`
  margin-bottom: 16px;
`;

const TitleText = styled.Text`
  font-size: 20px;
`;

const TableContainer = styled.View`
  margin-bottom: 32px;
`;

const Table = styled.View`
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const TableHeader = styled.View``;

const TableBody = styled.View``;

const TableRow = styled.View`
  flex-direction: row;
`;

const TableCell = styled.Text<{ width: number }>`
  width: ${(props) => props.width};
  text-align: center;
  padding: 8px;
`;

const ContestTeam = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ContestTeamName = styled.View`
  min-width: 40%;
  padding: 18px;
`;

const ContestTeamNameText = styled.Text``;

const ContestUser = styled.View`
  min-width: 30%;
  padding: 4px;
`;

const ContestUserName = styled.TouchableOpacity``;

const ContestUserNameText = styled.Text`
  padding: 4px;
`;

const ContestTeamResult = styled.View`
  min-width: 30%;
  flex-direction: row;
  padding: 4px;
`;

const ContestTeamResultText = styled.Text`
  padding: 4px;
  margin-right: 4px;
`;

export default function ContestMatchDetail({ navigation, route }: any) {
  const { width, height } = useWindowDimensions();
  const [cellWidth, setCellWidth] = useState(0);

  const { data: contestTeamList } = useQuery(SEE_CONTEST_MATCH_GROUP, {
    variables: { contestMatchGroupId: route.params.groupMatchId },
  });
  const { data: contestMatchHistory } = useQuery(
    SEE_CONTEST_MATCH_GROUP_HISTORY,
    {
      variables: { contestMatchGroupId: route.params.groupMatchId },
    }
  );

  const { data: contestMatchResult } = useQuery(
    SEE_CONTEST_MATCH_GROUP_RESULT,
    {
      variables: { contestMatchGroupId: route.params.groupMatchId },
      fetchPolicy: "network-only",
    }
  );

  const goToProfile = (username: any, id: any) => {
    navigation.navigate("Profile", {
      username: username,
      id: id,
    });
  };

  useEffect(() => {
    navigation.setOptions({
      title: route.params.groupNo + "조 상세정보",
    });
  }, []);

  useEffect(() => {
    if (
      contestTeamList?.seeContestMatchTeam !== undefined &&
      contestTeamList?.seeContestMatchTeam !== null
    ) {
      let length = contestTeamList?.seeContestMatchTeam.length + 1;
      let cWidth = width / length - 8;
      setCellWidth(cWidth);
    }
  }, [contestTeamList]);

  return (
    <MatchDetailContainer>
      <TableContainer>
        <Title>
          <TitleText>경기 요약</TitleText>
        </Title>
        <Table>
          <TableHeader>
            <TableRow style={{ borderBottomWidth: 1 }}>
              <TableCell width={cellWidth}></TableCell>
              {contestTeamList?.seeContestMatchTeam !== undefined &&
              contestTeamList?.seeContestMatchTeam !== null
                ? contestTeamList?.seeContestMatchTeam.map((item: any) => {
                    return (
                      <TableCell width={cellWidth} key={item.id}>
                        {item.teamName}
                      </TableCell>
                    );
                  })
                : null}
            </TableRow>
          </TableHeader>
          <TableBody>
            {contestTeamList?.seeContestMatchTeam !== undefined &&
            contestTeamList?.seeContestMatchTeam !== null
              ? contestTeamList?.seeContestMatchTeam.map(
                  (team: any, index: any) => {
                    return (
                      <TableRow
                        key={index}
                        style={{
                          borderBottomWidth:
                            index ===
                            contestTeamList?.seeContestMatchTeam.length - 1
                              ? 0
                              : 1,
                          borderColor: "#ccc",
                        }}
                      >
                        <TableCell width={cellWidth}>{team.teamName}</TableCell>
                        {contestTeamList?.seeContestMatchTeam !== undefined &&
                        contestTeamList?.seeContestMatchTeam !== null
                          ? contestTeamList?.seeContestMatchTeam.map(
                              (list: any) => {
                                if (team.id === list.id) {
                                  return (
                                    <TableCell
                                      width={cellWidth}
                                      key={list.id}
                                      style={{ backgroundColor: "#ccc" }}
                                    >
                                      -
                                    </TableCell>
                                  );
                                } else if (team.id !== list.id) {
                                  return contestMatchHistory?.seeContestGroupMatchHistory.map(
                                    (item: any) => {
                                      if (
                                        team.id === item.contestTeam.id &&
                                        list.id === item.opponentTeam.id
                                      ) {
                                        return (
                                          <TableCell
                                            width={cellWidth}
                                            key={item.id}
                                          >
                                            {(item.winScore || 0) +
                                              ":" +
                                              (item.loseScore || 0)}
                                          </TableCell>
                                        );
                                      }
                                    }
                                  );
                                }
                              }
                            )
                          : null}
                      </TableRow>
                    );
                  }
                )
              : null}
          </TableBody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Title>
          <TitleText>팀 정보</TitleText>
        </Title>
        <Table>
          <TableBody>
            {contestMatchResult !== undefined && contestMatchResult !== null
              ? contestMatchResult?.seeContestGroupMatchResult.map(
                  (team: any, index: any) => {
                    return (
                      <TableRow
                        key={index}
                        style={{
                          borderBottomWidth:
                            index ===
                            contestMatchResult?.seeContestGroupMatchResult
                              .length -
                              1
                              ? 0
                              : 1,
                          borderColor: "#ccc",
                        }}
                      >
                        <ContestTeam>
                          <ContestTeamName
                            style={{ borderRightWidth: 1, borderColor: "#ccc" }}
                          >
                            <ContestTeamNameText>
                              {team.contestTeam.teamName}
                            </ContestTeamNameText>
                          </ContestTeamName>
                          <ContestUser
                            style={{ borderRightWidth: 1, borderColor: "#ccc" }}
                          >
                            {team?.contestTeam?.contestUser !== undefined &&
                            team?.contestTeam?.contestUser !== null &&
                            team?.contestTeam?.contestUser.length > 0 ? (
                              team?.contestTeam.contestUser.map((item: any) => {
                                if (team?.contestTeam?.contestUser.length < 2) {
                                  return (
                                    <>
                                      <ContestUserName
                                        onPress={() =>
                                          goToProfile(
                                            item.user.username,
                                            item.user.id
                                          )
                                        }
                                      >
                                        <ContestUserNameText>
                                          {item.user.username}
                                        </ContestUserNameText>
                                      </ContestUserName>
                                      <ContestUserName disabled={true}>
                                        <ContestUserNameText>
                                          미정
                                        </ContestUserNameText>
                                      </ContestUserName>
                                    </>
                                  );
                                }
                                return (
                                  <ContestUserName
                                    onPress={() =>
                                      goToProfile(
                                        item.user.username,
                                        item.user.id
                                      )
                                    }
                                  >
                                    <ContestUserNameText>
                                      {item.user.username}
                                    </ContestUserNameText>
                                  </ContestUserName>
                                );
                              })
                            ) : (
                              <>
                                <ContestUserName disabled={true}>
                                  <ContestUserNameText>
                                    미정
                                  </ContestUserNameText>
                                </ContestUserName>
                                <ContestUserName disabled={true}>
                                  <ContestUserNameText>
                                    미정
                                  </ContestUserNameText>
                                </ContestUserName>
                              </>
                            )}
                          </ContestUser>
                          <ContestTeamResult>
                            <ContestTeamResultText>
                              {team.totalWin} 승
                            </ContestTeamResultText>
                            <ContestTeamResultText>
                              {team.totalLose} 패
                            </ContestTeamResultText>
                          </ContestTeamResult>
                        </ContestTeam>
                      </TableRow>
                    );
                  }
                )
              : null}
          </TableBody>
        </Table>
      </TableContainer>
    </MatchDetailContainer>
  );
}
