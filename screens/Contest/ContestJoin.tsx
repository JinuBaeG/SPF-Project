import { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons, FontAwesome5, Entypo } from "@expo/vector-icons";
import useMe from "../../hooks/useMe";
import { RadioButton } from "react-native-paper";
import { gql, useMutation } from "@apollo/client";
import { Alert } from "react-native";
import { LOCAL_URL, OPER_URL } from "@env";
import axios from "axios";

const SEARCH_TEAM = gql`
  mutation findTeam($contestId: String, $teamName: String) {
    findTeam(contestId: $contestId, teamName: $teamName) {
      ok
      info
      contestTeamId
    }
  }
`;

const CREATE_CONTEST_USER_MUTATION = gql`
  mutation createContestUser(
    $teamName: String
    $userAge: String
    $userGender: String
    $userTier: String
    $phoneNumber: String
    $contestSports: String
    $contestSportsType: String
    $contestId: String
    $userId: String
  ) {
    createContestUser(
      teamName: $teamName
      userAge: $userAge
      userGender: $userGender
      userTier: $userTier
      phoneNumber: $phoneNumber
      contestSports: $contestSports
      contestSportsType: $contestSportsType
      contestId: $contestId
      userId: $userId
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
  align-items: center;
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
  margin-bottom: 8px;
`;

const ContestTeam = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 4px;
`;

const ContestTeamInput = styled.TextInput`
  width: 80%;
`;

const PhoneCheckBtn = styled.TouchableOpacity<{ certified: Boolean }>`
  width: 20%;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #01aa73;
  opacity: ${(props) => (props.certified ? "0.5" : "1")};
`;

const ContestTeamCheckButton = styled.TouchableOpacity`
  width: 20%;
  padding: 4px;
  border-radius: 4px;
  border: 1px solid #01aa73;
`;

const ContestTier = styled.View`
  justify-content: center;
  margin-bottom: 8px;
`;

const ContestAge = styled.View`
  padding: 4px;
`;

const ContestAgeInput = styled.TextInput``;

const ContestGender = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 8px;
`;

const ContestJoinButton = styled.TouchableOpacity`
  border-radius: 8px;
  border: 1px solid #ccc;
  justify-content: center;
  align-items: center;
  padding: 16px;
  margin-bottom: 32px;
`;

const ContestJoinButtonText = styled.Text``;

export default function ContestJoin({ navigation, route }: any) {
  const contest = route.params.contest;

  const me: any = useMe();
  const [checked, setChecked] = useState<any>();
  const [sportsEventDetail, setSportsEventDetail] = useState<any>([]);
  const [date, setDate] = useState<any>();
  const [username, setUsername] = useState<any>("");
  const [phoneNumber, setPhoneNumber] = useState<any>(0);
  const [teamCheck, setTeamCheck] = useState<any>("");
  const [userTier, setUserTier] = useState<any>("초보");
  const [userAge, setUserAge] = useState<any>(0);
  const [userGender, setUserGender] = useState<any>("남자");

  // 휴대전화번호 인증을 위한 useState 세팅

  const [phoneCheck, setPhoneCheck] = useState<any>(true);
  const [certified, setCertified] = useState<any>(false);
  const [activeCertified, setActiveCertified] = useState(true);
  const [certifiedNumber, setCertifiedNumber] = useState("");
  const [makedCertifiedNumber, setMakedCertifiedNumber] = useState("");
  const [certifiedEditble, setCertifiedEditable] = useState(true);
  const [certifiedComplete, setCertifiedComplete] = useState(false);
  const [visibleModal, setVisibleModal] = useState(false);

  const setContestStartDate = () => {
    const weekDay = ["일", "월", "화", "수", "목", "금", "토"];
    const getStartDate = new Date(contest.contestStartDate);
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

  const onSearchCompleted = (data: any) => {
    const {
      findTeam: { ok, info },
    } = data;

    if (ok) {
      Alert.alert(info);
    } else {
      Alert.alert(info);
    }
  };

  const [findTeamMutation] = useMutation(SEARCH_TEAM, {
    onCompleted: onSearchCompleted,
  });

  const onSearchTeam = (teamCheck: any) => {
    findTeamMutation({
      variables: { contestId: contest.contestId, teamName: teamCheck },
    });
  };

  // 등록 완료 뒤 리스트로 이동
  const onCompleted = (data: any) => {
    const {
      createContestUser: { ok, id },
    } = data;

    if (ok) {
      navigation.replace("ContestJoinCheck", {
        id,
        contestId: contest.contestId,
      });
    }
  };

  // 등록
  const [createContestMutation] = useMutation<any>(
    CREATE_CONTEST_USER_MUTATION,
    {
      onCompleted,
    }
  );

  const onValidationCheck = () => {
    if (teamCheck == "") {
      Alert.alert("팀명을 입력해야 합니다.");
      return;
    }
    if (userAge == "" || userAge == 0) {
      Alert.alert("나이를 입력해야 합니다.");
      return;
    }
    if (phoneCheck == true) {
      Alert.alert("본인인증을 완료해야 합니다.");
      return;
    }

    onJoinContest();
  };

  const onJoinContest = () => {
    createContestMutation({
      variables: {
        teamName: teamCheck,
        userAge,
        userGender,
        userTier,
        phoneNumber: phoneNumber.toString(),
        contestSports: contest.contestSports,
        contestSportsType: checked,
        contestId: contest.contestId,
        userId: me.data.me.id,
      },
    });
  };

  const makeCertifedNumber = () => {
    const url =
      process.env.NODE_ENV === "development"
        ? `${LOCAL_URL}:4000/api/certified`
        : `${OPER_URL}:4000/api/certified`;
    const response: any = axios({
      method: "GET",
      url: url,
      params: {
        number: `${phoneNumber}`,
      },
    })
      .then((res) => {
        setMakedCertifiedNumber(res.data.crtNumber);
        setPhoneCheck(false);
        setActiveCertified(true);
        setCertified(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 휴대전화번호 길이 체크 (11자리)
  const checkPhoneNumberLength = () => {
    if (phoneNumber.length === 11) {
      setActiveCertified(!activeCertified);
    } else {
      setActiveCertified(true);
    }
  };

  // 인증번호 확인 처리
  const checkCertifedNumber = () => {
    if (makedCertifiedNumber === certifiedNumber) {
      Alert.alert("인증완료 되었습니다.");
    } else {
      Alert.alert("올바르지 않은 인증번호 입니다.");
      setCertifiedComplete(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: contest.contestName,
    });
    const splitData = contest.contestSportsDetail.split("/");
    setUsername(me.data.me.username);
    setSportsEventDetail(splitData);
    setContestStartDate();
    setChecked(splitData[0]);
  }, []);

  return (
    <Container>
      <ContestInfoContainer>
        <ContestTitle>
          <ContestTitleText>{contest.contestName}</ContestTitleText>
        </ContestTitle>
        <ContestInfo>
          <ContestDate>
            <ContestInfoIcon>
              <Ionicons name="calendar-outline" size={16} color="gray" />
            </ContestInfoIcon>
            <ContestInfoText>{date}</ContestInfoText>
          </ContestDate>
          <ContestStadium>
            <ContestInfoIcon>
              <FontAwesome5 name="map-marker-alt" size={16} color="gray" />
            </ContestInfoIcon>
            <ContestInfoText>{contest.contestStadium}</ContestInfoText>
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
              <ContestInfoText>{contest.contestSports}</ContestInfoText>
            </ContestSportsInfoRow>
            <ContestSportsInfoRow>
              <ContestInfoTitle>참가비</ContestInfoTitle>
              <ContestInfoText>
                {contest.contestEntryFee.replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                  "원"}
              </ContestInfoText>
            </ContestSportsInfoRow>
          </ContestSportsInfo>
        </ContestInfo>
      </ContestInfoContainer>
      <ContestInputContainer>
        <ContestInput>
          <ContestInputTitle>참가자 이름</ContestInputTitle>
          <ContestUser
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestUserInput defaultValue={username} editable={false} />
          </ContestUser>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>참가 종목 타입</ContestInputTitle>
          <RadioButton.Group
            onValueChange={(newValue) => setChecked(newValue)}
            value={checked}
          >
            <ContestSports>
              {sportsEventDetail.map((item: any, index: any) => {
                return (
                  <RadioButton.Item
                    key={index}
                    label={item}
                    value={item}
                    color="#01aa73"
                    uncheckedColor="gray"
                  />
                );
              })}
            </ContestSports>
          </RadioButton.Group>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>휴대전화번호</ContestInputTitle>
          <ContestTeam
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestTeamInput
              value={phoneNumber}
              keyboardType="number-pad"
              placeholder="휴대전화번호"
              placeholderTextColor={"#888888"}
              onChangeText={(text: any) => {
                setPhoneNumber(text);
                checkPhoneNumberLength();
              }}
              editable={phoneCheck}
            />
            <PhoneCheckBtn
              onPress={() => {
                if (
                  phoneNumber !== null &&
                  phoneNumber !== undefined &&
                  phoneNumber !== ""
                ) {
                  makeCertifedNumber();
                  setCertified(!certified);
                  setActiveCertified(true);
                } else {
                  Alert.alert("휴대전화번호를 입력하세요");
                }
              }}
              disabled={activeCertified}
              certified={activeCertified}
            >
              <ContestInputText style={{ textAlign: "center" }}>
                문자인증
              </ContestInputText>
            </PhoneCheckBtn>
          </ContestTeam>
        </ContestInput>
        {certified ? (
          <ContestInput>
            <ContestInputTitle>인증번호</ContestInputTitle>
            <ContestTeam
              style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
            >
              <ContestTeamInput
                value={certified}
                keyboardType="number-pad"
                placeholder="인증번호"
                placeholderTextColor={"#888888"}
                onChangeText={(text: any) => setCertifiedNumber(text)}
                editable={certifiedEditble}
              />
              <PhoneCheckBtn
                onPress={() => {
                  setCertifiedComplete(!certifiedComplete);
                  checkCertifedNumber();
                  setCertifiedEditable(!certifiedEditble);
                }}
                disabled={certifiedComplete}
                certified={certifiedComplete}
              >
                <ContestInputText style={{ textAlign: "center" }}>
                  인증확인
                </ContestInputText>
              </PhoneCheckBtn>
            </ContestTeam>
          </ContestInput>
        ) : null}
        <ContestInput>
          <ContestInputTitle>팀명</ContestInputTitle>
          <ContestTeam
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestTeamInput
              value={teamCheck}
              onChangeText={(text: any) => setTeamCheck(text)}
            />
            <ContestTeamCheckButton
              onPress={() => {
                if (
                  teamCheck !== null &&
                  teamCheck !== undefined &&
                  teamCheck !== ""
                ) {
                  onSearchTeam(teamCheck);
                }
              }}
            >
              <ContestInputText style={{ textAlign: "center" }}>
                확인
              </ContestInputText>
            </ContestTeamCheckButton>
          </ContestTeam>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>참가자 연령</ContestInputTitle>
          <ContestAge
            style={{ borderBottomWidth: 1, borderBottomColor: "gray" }}
          >
            <ContestAgeInput
              value={userAge}
              keyboardType="number-pad"
              placeholder="나이"
              placeholderTextColor={"#888888"}
              onChangeText={(text: any) => {
                setUserAge(text);
              }}
            />
          </ContestAge>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>참가자 성별</ContestInputTitle>
          <RadioButton.Group
            onValueChange={(newValue) => setUserGender(newValue)}
            value={userGender}
          >
            <ContestTier>
              <RadioButton.Item label={"남자"} value={"남자"} color="#01aa73" />
              <RadioButton.Item label={"여자"} value={"여자"} color="#01aa73" />
            </ContestTier>
          </RadioButton.Group>
        </ContestInput>
        <ContestInput>
          <ContestInputTitle>참가자 등급</ContestInputTitle>

          <RadioButton.Group
            onValueChange={(newValue) => setUserTier(newValue)}
            value={userTier}
          >
            <ContestTier>
              <RadioButton.Item label={"초보"} value={"초보"} color="#01aa73" />
              <RadioButton.Item label={"자강"} value={"자강"} color="#01aa73" />
              <RadioButton.Item label={"A"} value={"A"} color="#01aa73" />
              <RadioButton.Item label={"B"} value={"B"} color="#01aa73" />
              <RadioButton.Item label={"C"} value={"C"} color="#01aa73" />
              <RadioButton.Item label={"D"} value={"D"} color="#01aa73" />
            </ContestTier>
          </RadioButton.Group>
        </ContestInput>
        <ContestJoinButton
          onPress={() => {
            onValidationCheck();
          }}
        >
          <ContestJoinButtonText>등록하기</ContestJoinButtonText>
        </ContestJoinButton>
      </ContestInputContainer>
    </Container>
  );
}
