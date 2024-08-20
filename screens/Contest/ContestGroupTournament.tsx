import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import styled from "styled-components/native";
import Swiper from "react-native-swiper";
import { Text, View } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";

const SEE_CONTEST_TOURNAMENT_GROUP = gql`
  query seeContestTournamentGroup($contestGroupId: String) {
    seeContestTournamentGroup(contestGroupId: $contestGroupId) {
      id
      name
      nextMatchId
      matchNo
      tournamentRoundText
      startTime
      startTimeHour
      startTimeMin
      state
      participants {
        id
        name
        isWinner
        status
        resultText
        matchNo
        contestCourt {
          id
          courtName
        }
        contestTeam {
          id
          teamName
        }
      }
    }
  }
`;

const Container = styled.ScrollView`
  padding: 16px;
`;

const TournamentContainer = styled.SafeAreaView`
  height: 100%;
  justify-content: center;
  alig-items: center;
  padding: 16px;
`;

const TournamentMatchContainer = styled.View`
  margin: 16px;
  border-radius: 8px;
`;

const TournamentMatchTeam = styled.View<{ isWinner: boolean }>`
  flex-direction:row;
  justify-content:space-between;
  background-color : ${(props) => (props.isWinner ? "orage" : "white")}
  padding: 16px;
`;

const TournamentMatchTeamText = styled.Text``;

const TournamentMatchScoreText = styled.Text``;

const TournamentMatchLine = styled.View`
  height: 1px;
  background-color: #ccc;
`;

export default function ContestGroupTournament({ navigation, route }: any) {
  const contestId = route.params.contestId;
  const contestGroupName = route.params.contestGroupName;
  const contestGroupId = route.params.contestGroupId;
  const roundAdvance = route.params.roundAdvance;
  const startRound = route.params.startRound;
  const createMatchYN = route.params.createMatchYN;

  const { data: contestTournament, loading } = useQuery(
    SEE_CONTEST_TOURNAMENT_GROUP,
    {
      variables: {
        contestGroupId: contestGroupId,
      },
    }
  );

  const [tournamentRound, setTournamentRound] = useState<any>([]);

  const setTournament = () => {
    let roundCount = 0;
    let count = startRound;
    while (count > 1) {
      count = count / 2;
      roundCount++;
    }

    let setRound = new Array(roundCount);
    let loopIndex = roundCount;

    for (let i = 0; i < roundCount; i++) {
      setRound[i] = loopIndex;
      loopIndex--;
    }

    setTournamentRound(setRound);
  };

  useLayoutEffect(() => {
    setTournament();
  }, []);

  return (
    <Container>
      <Swiper
        loop={false}
        showsButtons={true}
        showsPagination={true}
        autoplay={false}
      >
        {tournamentRound.length > 0 ? (
          tournamentRound?.map((item: any, index: any) => {
            return (
              <TournamentContainer key={index}>
                {contestTournament?.seeContestTournamentGroup.map(
                  (team: any, idx: any) => {
                    if (team.tournamentRoundText === item.toString()) {
                      return (
                        <TournamentMatchContainer
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
                          key={idx}
                        >
                          <TournamentMatchTeam
                            isWinner={team.participants[0].isWinner}
                          >
                            <TournamentMatchTeamText>
                              {team.participants[0].name}
                            </TournamentMatchTeamText>
                            <TournamentMatchScoreText>
                              {team.participants[0].resultText}
                            </TournamentMatchScoreText>
                          </TournamentMatchTeam>
                          <TournamentMatchLine></TournamentMatchLine>
                          <TournamentMatchTeam
                            isWinner={team.participants[1].isWinner}
                          >
                            <TournamentMatchTeamText>
                              {team.participants[1].name}
                            </TournamentMatchTeamText>
                            <TournamentMatchScoreText>
                              {team.participants[1].resultText}
                            </TournamentMatchScoreText>
                          </TournamentMatchTeam>
                        </TournamentMatchContainer>
                      );
                    }
                  }
                )}
              </TournamentContainer>
            );
          })
        ) : (
          <TournamentContainer></TournamentContainer>
        )}
      </Swiper>
    </Container>
  );
}
