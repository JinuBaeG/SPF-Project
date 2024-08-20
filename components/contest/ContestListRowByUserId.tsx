import { useReactiveVar } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { isLoggedInVar } from "../../apollo";
import { Alert } from "react-native";
import useMe from "../../hooks/useMe";

const ListRowContainer = styled.TouchableOpacity`
  width: 100%;
  padding: 8px;
  border-radius: 8px;
  margin-bottom: 8px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ViewDate = styled.View`
  padding: 8px;
  justify-contet: center;
  align-items: center;
`;

const TextDate = styled.Text`
  font-size: 20px;
  font-weight: 600;
  font-family: "Roboto";
`;

const TextDay = styled.Text``;

const VerticalLine = styled.View`
  width: 1px;
  height: 36px;
  background-color: #ccc;
  margin: 0 8px;
`;

const ContestInfo = styled.View`
  justify-content: center;
  align-items: flex-start;
  padding: 8px;
`;

const ContestTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
`;

const DescWrap = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

const ContestDesc = styled.Text`
  font-size: 12px;
  color: #aaa;
`;

const ContestStatus = styled.View<{ status: string | undefined }>`
  min-width: 60px;
  padding: 4px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: ${(props) =>
    props.status === "모집중" ? "#ff5555" : "white"};
`;

const StatusText = styled.Text<{ status: string | undefined }>`
  font-size: 12px;
  text-align: center;
  color: ${(props) => (props.status === "모집중" ? "white" : "black")};
  font-weight: ${(props) => (props.status === "모집중" ? "600" : "normal")};
`;

const FowardWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Point = styled.View`
  width: 2px;
  height: 2px;
  background-color: #aaa;
  margin: 0 4px;
`;

export default function ContestListRowByUserId(contest: any) {
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState<string>();
  const ViewWeek = new Array("일", "월", "화", "수", "목", "금", "토");
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const me = useMe();
  const setDayView = (date: any) => {
    const curDate = new Date(date);

    let getDay = curDate.getDay();

    return ViewWeek[getDay];
  };
  const setDateView = (date: any) => {
    const curDate = new Date(date);

    let getDate = curDate.getDate();

    return getDate.toString().padStart(2, "00");
  };

  useEffect(() => {
    const today = new Date();
    let contestStart = new Date(contest.contestStartDate);
    let contestEnd = new Date(contest.contestEndDate);
    let recuirtStart = new Date(contest.contestRecruitStart);
    let recuirtEnd = new Date(contest.contestRecruitEnd);

    contestEnd.setHours(contestEnd.getHours() + 8);
    contestEnd.setMinutes(contestEnd.getMinutes() + 59);
    contestEnd.setSeconds(contestEnd.getSeconds() + 59);

    recuirtEnd.setHours(recuirtEnd.getHours() + 8);
    recuirtEnd.setMinutes(recuirtEnd.getMinutes() + 59);
    recuirtEnd.setSeconds(recuirtEnd.getSeconds() + 59);

    if (contestStart < today && contestEnd > today) {
      setStatus("진행중");
    } else if (contestStart > today && recuirtEnd < today) {
      setStatus("진행예정");
    } else if (recuirtStart < today && recuirtEnd > today) {
      setStatus("모집중");
    } else if (recuirtStart > today) {
      setStatus("모집예정");
    } else if (contestEnd < today) {
      setStatus("대회완료");
    }
  }, [contest]);
  return (
    <ListRowContainer
      onPress={() => {
        if (isLoggedIn) {
          navigation.navigate("ContestJoinCheck", {
            id: contest.contestUser.id,
            contestId: contest.contestId,
            userId: me.data.me.userId,
          });
        } else {
          Alert.alert("로그인 후 이용가능합니다.");
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
      <FowardWrap>
        <ViewDate>
          <TextDate>{setDateView(contest.contestStartDate)}</TextDate>
          <TextDay>{setDayView(contest.contestStartDate)}</TextDay>
        </ViewDate>
        <VerticalLine />
        <ContestInfo>
          <ContestTitle ellipsizeMode="tail">
            {contest.contestName}
          </ContestTitle>
          <DescWrap>
            <ContestDesc>{contest.contestStadium}</ContestDesc>
            <Point />
            <ContestDesc>{contest.contestSports}</ContestDesc>
          </DescWrap>
        </ContestInfo>
      </FowardWrap>
      <ContestStatus status={status}>
        <StatusText status={status}>{status}</StatusText>
      </ContestStatus>
    </ListRowContainer>
  );
}
