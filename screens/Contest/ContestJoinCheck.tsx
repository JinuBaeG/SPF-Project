import styled from "styled-components/native";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import useMe from "../../hooks/useMe";
import axios from "axios";
import { LOCAL_URL, OPER_URL } from "@env";
import { IMPConst } from "iamport-react-native";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

const SEE_CONTEST_JOIN_CHECK = gql`
  query seeContestJoinCheck($contestId: String, $userId: String) {
    seeContestJoinCheck(contestId: $contestId, userId: $userId) {
      id
      phoneNumber
      user {
        id
        username
        email
        avatar
      }
      userAge
      userGender
      userTier
      contestSports
      contestSportsType
      contestPaymentId
      contestPaymentStatus
      contestTeam {
        id
        teamName
      }
      contest {
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
      }
    }
  }
`;

const CREATE_PAYMENTID = gql`
  mutation createContestPaymentId($contestUserId: String) {
    createContestPaymentId(contestUserId: $contestUserId) {
      ok
      paymentId
      error
    }
  }
`;

const UPDATE_CONTEST_STATUS = gql`
  mutation updateContestJoinStatus($contestPaymentId: String, $status: String) {
    updateContestJoinStatus(
      contestPaymentId: $contestPaymentId
      status: $status
    ) {
      ok
      error
    }
  }
`;

const Container = styled.ScrollView`
  flex: 1;
`;

const ContestInfoContainer = styled.View`
  padding: 16px;
`;

const ContestTitle = styled.View``;

const ContestTitleText = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
`;

const ContestInfo = styled.View``;

const ContestDate = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const ContestDateSort = styled.View`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`;

const ContestStadium = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const ContestEntryFee = styled.View`
  flex-direction: row;
  margin-bottom: 8px;
`;

const ContestSportsInfo = styled.View`
  padding: 16px;
  background-color: #ffffff;
  border-radius: 4px;
`;

const ContestSportsInfoRow = styled.View`
  flex-direction: row;
  margin-bottom: 4px;
`;

const ContestInfoTitle = styled.Text`
  font-weight: 600;
  min-width: 20%;
`;

const ContestInfoText = styled.Text``;

const ContestInfoIcon = styled.View`
  width: 20px;
  align-items: flex-start;
  justify-content: center;
  margin-right: 4px;
`;

const ContestInputContainer = styled.View`
  padding: 16px;
  background-color: #ffffff;
`;

const ContestInput = styled.View`
  margin-bottom: 16px;
`;

const ContestInputTitle = styled.Text`
  font-weight: 600;
  margin-bottom: 4px;
`;

const ContestInputText = styled.Text``;

const ContestUser = styled.View`
  padding: 4px;
`;

const ContestUserInput = styled.TextInput``;

const ContestSports = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px;
  margin-bottom: 8px;
`;

const ContestTeam = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px;
`;

const ContestTier = styled.View`
  justify-content: center;
  margin-bottom: 8px;
  padding: 4px;
`;

const ContestAge = styled.View`
  padding: 4px;
`;

const ContestButtonContainer = styled.View`
  justify-content: center;
  align-items: center;
`;

const ContestJoinButton = styled.TouchableOpacity`
  border-radius: 8px;
  border: 1px solid #ccc;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin-bottom: 16px;
  width: 100%;
`;

const ContestJoinButtonText = styled.Text``;

export default function ContestJoinCheck({ navigation, route }: any) {
  const contest = route.params;
  const me = useMe();
  const [date, setDate] = useState<any>();
  const [recruitStartDate, setRecruitStartDate] = useState<any>();
  const [recruitEndDate, setRecruitEndDate] = useState<any>();
  const weekDay = ["일", "월", "화", "수", "목", "금", "토"];

  const { data: contestCheck } = useQuery(SEE_CONTEST_JOIN_CHECK, {
    variables: {
      contestId: contest.contestId,
      userId: me.data.me.id,
    },
    fetchPolicy: "network-only",
  });

  //결제 하기 - 시작
  const ContestJoinPaymentCancel = async (merchant_uid: any, amount: any) => {
    const url =
      process.env.NODE_ENV === "development"
        ? `${LOCAL_URL}:4000/payments/cancel`
        : `${OPER_URL}:4000/payments/cancel`;
    axios({
      method: "POST",
      url: url,
      params: {
        merchant_uid: merchant_uid,
        reason: "대회참가 취소",
        cancel_request_amount: amount,
      },
    })
      .then((res) => {
        console.log(res);
        Alert.alert("결제가 취소되었습니다.", "", [
          {
            text: "확인",
            onPress: () => {
              toggleCancel(
                contestCheck?.seeContestJoinCheck?.contestPaymentId,
                "결제진행"
              );
            },
          },
        ]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const createPaymentIdCompleted = (data: any) => {
    const {
      createContestPaymentId: { ok, error, paymentId },
    } = data;
    if (ok) {
      navigation.navigate("Payment", {
        params: {
          pg: "html5_inicis",
          pay_method: "card",
          merchant_uid: paymentId,
          name:
            contestCheck?.seeContestJoinCheck?.contest?.contestName + " 참가비",
          amount: contestCheck?.seeContestJoinCheck.contest.contestEntryFee,
          app_scheme: "com.funnyground.playinus.reactnative",
          buyer_name: contestCheck?.seeContestJoinCheck.user.username,
          buyer_tel: contestCheck?.seeContestJoinCheck.phoneNumber,
          buyer_email: contestCheck?.seeContestJoinCheck.user.email,
          m_redirect_url: IMPConst.M_REDIRECT_URL,
          niceMobileV2: true,
          escrow: false,
        },
      });
    }
  };

  const [createPaymentId] = useMutation(CREATE_PAYMENTID, {
    onCompleted: createPaymentIdCompleted,
  });

  const togglePayment = (id: any) => {
    createPaymentId({
      variables: {
        contestUserId: id,
      },
    });
  };
  //결제 하기 - 끝
  //결제 취소 - 시작
  const updateStatusCompleted = (data: any) => {
    const {
      updateContestJoinStatus: { ok, error },
    } = data;

    if (ok) {
      navigation.reset({ routes: [{ name: "Tabs" }] });
    }
  };

  const [updateContestMutation] = useMutation(UPDATE_CONTEST_STATUS, {
    onCompleted: updateStatusCompleted,
  });

  const toggleCancel = (contestPaymentId: any, status: string) => {
    updateContestMutation({
      variables: {
        contestPaymentId,
        status,
      },
    });
  };
  //결제 취소 - 끝

  const setRecruitDate = () => {
    const getRecruitStart = new Date(
      contestCheck?.seeContestJoinCheck?.contest?.contestRecruitStart
    );
    const getRecruitEnd = new Date(
      contestCheck?.seeContestJoinCheck?.contest?.contestRecruitEnd
    );
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
    const getStartDate = new Date(
      contestCheck?.seeContestJoinCheck?.contest?.contestStartDate
    );
    const year = getStartDate.getFullYear();
    const month = (getStartDate.getMonth() + 1).toString().padStart(2, "00");
    const day = getStartDate.getDate();
    const date = getStartDate.getDay();
    const hour = getStartDate.getHours().toString().padStart(2, "00");
    const min = getStartDate.getMinutes().toString().padStart(2, "00");

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
    navigation.setOptions({
      title: "등록확인",
    });
    setContestStartDate();
    setRecruitDate();
  }, [contestCheck]);

  return (
    <Container>
      <ContestInfoContainer>
        <ContestTitle>
          <ContestTitleText>
            {contestCheck?.seeContestJoinCheck.contest.contestName}
          </ContestTitleText>
        </ContestTitle>
        <ContestInfo>
          <ContestDate>
            <ContestInfoIcon>
              <Ionicons name="calendar-outline" size={16} color="gray" />
            </ContestInfoIcon>
            <ContestDateSort>
              <ContestInfoText>모집기간 : {recruitStartDate}</ContestInfoText>
              <ContestInfoText>~ {recruitEndDate}</ContestInfoText>
            </ContestDateSort>
          </ContestDate>
          <ContestDate>
            <ContestInfoIcon>
              <Ionicons name="calendar-outline" size={16} color="gray" />
            </ContestInfoIcon>
            <ContestInfoText>대회기간 : {date}</ContestInfoText>
          </ContestDate>
          <ContestStadium>
            <ContestInfoIcon>
              <FontAwesome5 name="map-marker-alt" size={16} color="gray" />
            </ContestInfoIcon>
            <ContestInfoText>
              {contestCheck?.seeContestJoinCheck.contest.contestStadium}
            </ContestInfoText>
          </ContestStadium>
          <ContestEntryFee>
            <ContestInfoIcon>
              <Ionicons
                name="md-information-circle-outline"
                size={16}
                color="gray"
              />
            </ContestInfoIcon>
            <ContestInfoText>{"참가비 및 정보"}</ContestInfoText>
          </ContestEntryFee>
          <ContestSportsInfo>
            <ContestSportsInfoRow>
              <ContestInfoTitle>종목</ContestInfoTitle>
              <ContestInfoText>
                {contestCheck?.seeContestJoinCheck.contestSports}
              </ContestInfoText>
            </ContestSportsInfoRow>
            <ContestSportsInfoRow>
              <ContestInfoTitle>참가비</ContestInfoTitle>
              <ContestInfoText>
                {contestCheck?.seeContestJoinCheck.contest.contestEntryFee.replace(
                  /\B(?=(\d{3})+(?!\d))/g,
                  ","
                ) + "원"}
              </ContestInfoText>
            </ContestSportsInfoRow>
          </ContestSportsInfo>
        </ContestInfo>
      </ContestInfoContainer>
      <ContestInputContainer>
        <ContestInput>
          <ContestInputTitle>참가자 정보</ContestInputTitle>
          <ContestUser
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestUserInput
              defaultValue={contestCheck?.seeContestJoinCheck.user.username}
              editable={false}
            />
          </ContestUser>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>참가 종목 타입</ContestInputTitle>

          <ContestSports
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestInputText>
              {contestCheck?.seeContestJoinCheck.contestSportsType}
            </ContestInputText>
          </ContestSports>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>팀명</ContestInputTitle>
          <ContestTeam
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestInputText>
              {contestCheck?.seeContestJoinCheck.contestTeam.teamName}
            </ContestInputText>
          </ContestTeam>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>참가자 연령</ContestInputTitle>
          <ContestAge
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestInputText>
              {contestCheck?.seeContestJoinCheck.userAge}
            </ContestInputText>
          </ContestAge>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>참가자 성별</ContestInputTitle>

          <ContestTier
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestInputText>
              {contestCheck?.seeContestJoinCheck.userGender}
            </ContestInputText>
          </ContestTier>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>참가자 등급</ContestInputTitle>

          <ContestTier
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestInputText>
              {contestCheck?.seeContestJoinCheck.userTier}
            </ContestInputText>
          </ContestTier>
        </ContestInput>
        <ContestButtonContainer>
          {contestCheck?.seeContestJoinCheck?.contestPaymentStatus ===
          "결제진행" ? (
            <ContestJoinButton
              onPress={() => {
                togglePayment(contestCheck?.seeContestJoinCheck?.id);
              }}
              style={{ backgroundColor: "#01aa73" }}
            >
              <ContestJoinButtonText
                style={{ color: "white", fontWeight: "bold" }}
              >
                결제하기(카드결제)
              </ContestJoinButtonText>
            </ContestJoinButton>
          ) : (
            <ContestJoinButton
              onPress={() => {
                ContestJoinPaymentCancel(
                  contestCheck?.seeContestJoinCheck?.contestPaymentId,
                  contestCheck?.seeContestJoinCheck.contest.contestEntryFee
                );
              }}
              style={{ backgroundColor: "#ff3300" }}
            >
              <ContestJoinButtonText
                style={{ color: "white", fontWeight: "bold" }}
              >
                결제취소
              </ContestJoinButtonText>
            </ContestJoinButton>
          )}
          {contestCheck?.seeContestJoinCheck?.contestPaymentStatus ===
          "결제진행" ? (
            <ContestJoinButton onPress={() => {}}>
              <ContestJoinButtonText style={{ color: "#ff3300" }}>
                참가취소
              </ContestJoinButtonText>
            </ContestJoinButton>
          ) : null}
        </ContestButtonContainer>
      </ContestInputContainer>
    </Container>
  );
}
