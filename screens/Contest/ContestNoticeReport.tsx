import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import ScreenLayout from "../../components/ScreenLayout";
import VirtualizedView from "../../components/shared/VirtualizedView";
import ContestNoticeToggle from "../../components/contest/ContestNoticeToggle";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";

const SEE_CONTEST_NOTICES = gql`
  query seeContestNotices($contestId: String) {
    seeContestNotices(contestId: $contestId) {
      id
      noticeTitle
      noticeDiscription
    }
  }
`;

const ContestNoticeContainer = styled.ScrollView`
  padding: 16px;
`;

const ContestNoticeTitle = styled.View`
  padding: 16px;
`;
const ContestNoticeTitleText = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

const ContestReportContainer = styled.TouchableOpacity`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ContestReport = styled.View``;
const ContestReportText = styled.Text`
  font-weight: 600;
`;

export default function ContestNoticeReport({ navigation, route }: any) {
  const contestId = route.params.contestId;

  const { data: contestNotices, loading: contestNoticesLoading } = useQuery(
    SEE_CONTEST_NOTICES,
    {
      variables: {
        contestId,
      },
    }
  );

  const renderNotices = ({ item: contestNotice, index }: any) => {
    return <ContestNoticeToggle {...contestNotice} />;
  };

  useEffect(() => {
    navigation.setOptions({
      title: "공지/문의",
    });
  }, []);

  return (
    <ScreenLayout loading={contestNoticesLoading}>
      <ContestNoticeTitle>
        <ContestNoticeTitleText>공지사항</ContestNoticeTitleText>
      </ContestNoticeTitle>
      <VirtualizedView>
        <ContestNoticeContainer>
          <FlatList
            style={{
              padding: 16,
              borderRadius: 8,
              backgroundColor: "#fff",
              borderColor: "#ccc",
              borderWidth: 1,
            }}
            data={contestNotices?.seeContestNotices}
            keyExtractor={(contest: any) => "" + contest.id}
            renderItem={renderNotices}
            initialNumToRender={6}
          />
        </ContestNoticeContainer>
        <ContestReportContainer
          style={{
            margin: 16,
            borderRadius: 8,
            backgroundColor: "#fff",
            borderColor: "#ccc",
            borderWidth: 1,
          }}
          onPress={() => navigation.navigate("ContestReport", { contestId })}
        >
          <ContestReport>
            <ContestReportText>대회 관련 문의하기</ContestReportText>
          </ContestReport>
          <Entypo name="chevron-thin-right" size={20} />
        </ContestReportContainer>
      </VirtualizedView>
    </ScreenLayout>
  );
}
