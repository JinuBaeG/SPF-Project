import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";

const GET_MATCH_SORTATION_LIST = gql`
  query getContestMatch($contestId: String) {
    getContestMatch(contestId: $contestId) {
      contestSportsDetail
    }
  }
`;

const ContestMatchSortation = styled.ScrollView`
  width: 100%;
  padding: 8px;
`;

const ContestMatchSortationButton = styled.TouchableOpacity<{
  active: boolean;
}>`
  padding: 8px;
  border-radius: 8px;
  background-color: ${(props) => (props.active ? "#01aa73" : "white")};
`;

const ButtonText = styled.Text<{
  active: boolean;
}>`
  color: ${(props) => (props.active ? "white" : "black")};
`;

const GroupList = ["전체", "A", "B", "C", "D", "초보", "자강"];

export default function ContestSortation({
  contestId,
  setSportsSort,
  sportsSort,
  setGroupSort,
  groupSort,
}: any) {
  const { data: contestSportsDetail } = useQuery(GET_MATCH_SORTATION_LIST, {
    variables: {
      contestId: contestId,
    },
  });

  const [sportsDetail, setSportsDetail] = useState(["전체"]);

  useEffect(() => {
    let detail =
      contestSportsDetail?.getContestMatch?.contestSportsDetail.split("/");
    if (detail !== undefined && detail !== null) {
      detail.map((item: any) => {
        setSportsDetail((sportsDetail) => [...sportsDetail, item]);
      });
    }
  }, [contestSportsDetail]);

  const onSetSportsDetail = (sports: any) => {
    setSportsSort(sports);
  };

  const onSetGroup = (group: any) => {
    setGroupSort(group);
  };

  const RenderSports = ({ item, index }: any) => {
    return (
      <ContestMatchSortationButton
        active={item === sportsSort ? true : false}
        onPress={() => {
          onSetSportsDetail(item);
        }}
      >
        <ButtonText active={item === sportsSort ? true : false}>
          {item}
        </ButtonText>
      </ContestMatchSortationButton>
    );
  };

  const RenderGroup = ({ item, index }: any) => {
    return (
      <ContestMatchSortationButton
        active={item === groupSort ? true : false}
        onPress={() => {
          onSetGroup(item);
        }}
      >
        <ButtonText active={item === groupSort ? true : false}>
          {item}
        </ButtonText>
      </ContestMatchSortationButton>
    );
  };

  return (
    <>
      <ContestMatchSortation horizontal showsHorizontalScrollIndicator={false}>
        {sportsDetail.map((item, index) => {
          return <RenderSports key={index} item={item} index={index} />;
        })}
      </ContestMatchSortation>
      <ContestMatchSortation horizontal showsHorizontalScrollIndicator={false}>
        {GroupList.map((item, index) => {
          return <RenderGroup key={index} item={item} index={index} />;
        })}
      </ContestMatchSortation>
    </>
  );
}
