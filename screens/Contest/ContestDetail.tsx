import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { Image, useWindowDimensions } from "react-native";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import useMe from "../../hooks/useMe";
import { start } from "repl";

const CHECK_JOIN_CONTEST = gql`
  query checkJoinContest($contestId: String, $userId: String) {
    checkJoinContest(contestId: $contestId, userId: $userId) {
      id
    }
  }
`;

const SEE_CONTEST_DETAIL = gql`
  query seeContest($contestId: String) {
    seeContest(contestId: $contestId) {
      id
      contestId
      contestName
      contestStartDate
      contestEndDate
      contestRecruitStart
      contestRecruitEnd
      contestPlace
      buildingNumber
      dongEubMyunName
      gusiName
      riName
      roadName
      sidoName
      zipcode
      areaLatitude
      areaLongtitude
      contestPlaceAddress
      contestStadium
      contestSports
      contestHost
      contestSportsDetail
      contestSponsorShip
      contestDiscription
      contestTerms
      contestEntryFee
      contestBanner
      contestRecruitNumber
      contestUserCount
      contestAwardDetails
    }
  }
`;

const ContestDetailContainer = styled.ScrollView`
  flex: 1;
  height: 100%;
`;

const ContestDetailBanner = styled.View`
  position: relative;
`;

const BannerImage = styled.Image``;

const ContestDetailInfo = styled.View`
  padding: 16px;
`;

const ContestSportsEvent = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const ContestSportsEventText = styled.Text`
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 25px;
  margin-right: 4px;
`;

const SportsEventDetailText = styled.Text`
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #ccc;
  min-width: 25px;
  margin-right: 4px;
`;

const ContestTitle = styled.View`
  padding: 16px 0;
`;

const ContestTitleText = styled.Text`
  font-size: 24px;
  font-weight: 600;
`;

const ContestDesc = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
  align-items: flex-start;
  justify-content: flex-start;
`;

const ContestDate = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const ContestDescIcon = styled.View`
  width: 20px;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;

const ContestDescText = styled.Text`
  font-size: 16px;
  color: gray;
`;

const ContestDetailButtonWrap = styled.View`
  justify-content: space-between;
  margin: 0 16px;
`;

const ContestDetailButton = styled.TouchableOpacity`
  padding: 16px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 8px;
`;

const ContestDetailButtonIcon = styled.View`
  align-items: center;
  justify-content: center;
  margin-right: 4px;
`;

const ContestDetailButtonText = styled.Text`
  font-size: 16px;
`;

const ContestDetailJoin = styled.View`
  padding: 16px;
`;

const ContestDetailJoinButton = styled.TouchableOpacity`
  padding: 16px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const ContestDetailJoinButtonText = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

export default function ContestDetail({ navigation, route }: any) {
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(0);
  const [sportsEventDetail, setSportsEventDetail] = useState<any>([]);
  const me = useMe();

  const { data: checkJoin } = useQuery(CHECK_JOIN_CONTEST, {
    variables: {
      contestId: route.params.contestId,
      userId: me.data.me.id,
    },
    fetchPolicy: "network-only",
  });

  const { data: contestData, loading: contestLoading } = useQuery(
    SEE_CONTEST_DETAIL,
    {
      variables: {
        contestId: route.params.contestId,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  Image.getSize(contestData?.seeContest?.contestBanner, (w, h) => {
    setImageHeight(h * (width / w));
  });

  const [date, setDate] = useState<any>();
  const [curDate, setCurDate] = useState<any>(new Date());
  const [startDate, setStartDate] = useState<any>();
  const [recruitStartDate, setRecruitStartDate] = useState<any>();
  const [recruitEndDate, setRecruitEndDate] = useState<any>();
  const weekDay = ["일", "월", "화", "수", "목", "금", "토"];

  const setRecruitDate = () => {
    const getRecruitStart = new Date(
      contestData?.seeContest?.contestRecruitStart
    );
    const getRecruitEnd = new Date(contestData?.seeContest?.contestRecruitEnd);
    let year = getRecruitStart.getFullYear();
    let month = (getRecruitStart.getMonth() + 1).toString().padStart(2, "00");
    let day = getRecruitStart.getDate().toString().padStart(2, "00");
    let date = getRecruitStart.getDay();
    let hour = getRecruitStart.getHours().toString().padStart(2, "00");
    let min = getRecruitStart.getMinutes().toString().padStart(2, "00");

    setRecruitStartDate(
      year +
        "-" +
        month +
        "-" +
        day +
        " (" +
        weekDay[date] +
        ") " +
        hour +
        ":" +
        min
    );

    year = getRecruitEnd.getFullYear();
    month = (getRecruitEnd.getMonth() + 1).toString().padStart(2, "00");
    day = getRecruitEnd.getDate().toString().padStart(2, "00");
    date = getRecruitEnd.getDay();
    hour = getRecruitEnd.getHours().toString().padStart(2, "00");
    min = getRecruitEnd.getMinutes().toString().padStart(2, "00");

    setRecruitEndDate(
      year +
        "-" +
        month +
        "-" +
        day +
        " (" +
        weekDay[date] +
        ") " +
        hour +
        ":" +
        min
    );
  };

  const setContestStartDate = () => {
    const getStartDate = new Date(contestData?.seeContest?.contestStartDate);
    const year = getStartDate.getFullYear();
    const month = (getStartDate.getMonth() + 1).toString().padStart(2, "00");
    const day = getStartDate.getDate().toString().padStart(2, "00");
    const date = getStartDate.getDay();
    const hour = getStartDate.getHours().toString().padStart(2, "00");
    const min = getStartDate.getMinutes().toString().padStart(2, "00");
    setStartDate(getStartDate);

    setDate(
      year +
        "-" +
        month +
        "-" +
        day +
        " (" +
        weekDay[date] +
        ") " +
        hour +
        ":" +
        min
    );
  };

  useEffect(() => {
    const splitData = contestData?.seeContest?.contestSportsDetail.split("/");
    setSportsEventDetail(splitData);
    setRecruitDate();
    setContestStartDate();
  }, [contestData]);

  return (
    <ScreenLayout loading={contestLoading}>
      <ContestDetailContainer>
        <ContestDetailBanner>
          <BannerImage
            resizeMode="stretch"
            style={{ width: "100%", height: imageHeight }}
            source={{ uri: contestData?.seeContest?.contestBanner }}
          />
        </ContestDetailBanner>
        <ContestDetailInfo>
          <ContestSportsEvent>
            <ContestSportsEventText>
              {contestData?.seeContest?.contestSports}
            </ContestSportsEventText>
            {sportsEventDetail !== undefined && sportsEventDetail !== null
              ? sportsEventDetail.map((event: any, index: number) => {
                  return (
                    <SportsEventDetailText key={index}>
                      {event}
                    </SportsEventDetailText>
                  );
                })
              : null}
          </ContestSportsEvent>
          <ContestTitle>
            <ContestTitleText>
              {contestData?.seeContest?.contestName}
            </ContestTitleText>
          </ContestTitle>
          <ContestDesc>
            <ContestDescIcon>
              <Ionicons name="calendar-outline" size={16} color="gray" />
            </ContestDescIcon>
            <ContestDate>
              <ContestDescText>모집기간 : {recruitStartDate}</ContestDescText>
              <ContestDescText> ~ {recruitEndDate}</ContestDescText>
            </ContestDate>
          </ContestDesc>
          <ContestDesc>
            <ContestDescIcon>
              <Ionicons name="calendar-outline" size={16} color="gray" />
            </ContestDescIcon>
            <ContestDescText>대회기간 : {date}</ContestDescText>
          </ContestDesc>
          <ContestDesc>
            <ContestDescIcon>
              <FontAwesome5 name="map-marker-alt" size={16} color="gray" />
            </ContestDescIcon>
            <ContestDescText>
              {contestData?.seeContest?.contestStadium}
            </ContestDescText>
          </ContestDesc>
          <ContestDesc>
            <ContestDescIcon>
              <Ionicons
                name="md-information-circle-outline"
                size={16}
                color="gray"
              />
            </ContestDescIcon>
            <ContestDescText>
              {"참가비 : " +
                contestData?.seeContest?.contestEntryFee.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                ) +
                "원"}
            </ContestDescText>
          </ContestDesc>
          <ContestDesc>
            <ContestDescIcon>
              <Ionicons name="people" size={16} color="gray" />
            </ContestDescIcon>
            <ContestDescText>
              참가인원 :{" "}
              {contestData?.seeContest?.contestUserCount +
                " / " +
                contestData?.seeContest?.contestRecruitNumber}
            </ContestDescText>
          </ContestDesc>
        </ContestDetailInfo>
        <ContestDetailButtonWrap>
          <ContestDetailButton
            onPress={() =>
              navigation.navigate("ContestDetailInfo", {
                contestDiscription: contestData?.seeContest?.contestDiscription,
              })
            }
          >
            <ContestDetailButtonIcon>
              <Ionicons name="list-outline" size={24} color={"black"} />
            </ContestDetailButtonIcon>
            <ContestDetailButtonText>대회안내</ContestDetailButtonText>
          </ContestDetailButton>
          <ContestDetailButton
            onPress={() =>
              navigation.navigate("ContestMatch", {
                contestId: contestData?.seeContest?.contestId,
              })
            }
          >
            <ContestDetailButtonIcon>
              <Entypo name="flow-tree" size={24} color={"black"} />
            </ContestDetailButtonIcon>
            <ContestDetailButtonText>대진표</ContestDetailButtonText>
          </ContestDetailButton>
          <ContestDetailButton
            onPress={() =>
              navigation.navigate("ContestUserList", {
                contestId: contestData?.seeContest?.contestId,
              })
            }
          >
            <ContestDetailButtonIcon>
              <Ionicons
                name="document-text-outline"
                size={24}
                color={"black"}
              />
            </ContestDetailButtonIcon>
            <ContestDetailButtonText>참가명단</ContestDetailButtonText>
          </ContestDetailButton>
          <ContestDetailButton
            onPress={() =>
              navigation.navigate("ContestAward", {
                contestAwardDetails:
                  contestData?.seeContest?.contestAwardDetails,
              })
            }
          >
            <ContestDetailButtonIcon style={{ paddingHorizontal: 4 }}>
              <FontAwesome5 name="award" size={24} color="black" />
            </ContestDetailButtonIcon>
            <ContestDetailButtonText>상금안내</ContestDetailButtonText>
          </ContestDetailButton>
          <ContestDetailButton
            onPress={() =>
              navigation.navigate("ContestNoticeReport", {
                contestId: contestData?.seeContest?.contestId,
              })
            }
          >
            <ContestDetailButtonIcon>
              <Ionicons name="notifications" size={24} color={"black"} />
            </ContestDetailButtonIcon>
            <ContestDetailButtonText>공지/문의</ContestDetailButtonText>
          </ContestDetailButton>
        </ContestDetailButtonWrap>
        <ContestDetailJoin>
          <ContestDetailJoinButton
            onPress={() => {
              navigation.navigate("ContestJoin", {
                contest: contestData?.seeContest,
              });
            }}
            disabled={
              curDate > startDate
                ? true
                : checkJoin?.checkJoinContest !== undefined &&
                  checkJoin?.checkJoinContest !== null
                ? true
                : false
            }
          >
            <ContestDetailJoinButtonText>
              {curDate > startDate
                ? "대회완료"
                : checkJoin?.checkJoinContest !== undefined &&
                  checkJoin?.checkJoinContest !== null
                ? "신청완료"
                : "신청하기"}
            </ContestDetailJoinButtonText>
          </ContestDetailJoinButton>
        </ContestDetailJoin>
      </ContestDetailContainer>
    </ScreenLayout>
  );
}
