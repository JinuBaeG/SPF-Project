import React, { useEffect } from "react";
import { View, Text, useColorScheme } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { cache, isLoggedInVar, logUserOut } from "../../apollo";
import useMe from "../../hooks/useMe";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import MyProfileCount from "../../components/Profile/MyProfieCount";
import ProfileMenu from "../../components/Profile/ProfileMenu";
import { useReactiveVar } from "@apollo/client";

// Header Style
const MyPageTitleWrap = styled.View`
  padding: 8px 16px;
`;

const MyPageTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const EditWrap = styled.View`
  padding: 8px 16px;
`;

const EditBtn = styled.TouchableOpacity``;

// In Container Style
// Container Top
const ProfileContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.grayInactColor};
`;

const ProfilePrivacyInfo = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 8px;
`;

const ProfileImageNameWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const ProfileImageWrap = styled.View`
  border-radius: 50px;
`;

const ProfileImage = styled.Image``;

const ProfileName = styled.Text`
  padding: 16px;
  font-size: 16px;
  font-weight: 600;
`;

const ProfileBtnWrap = styled.View``;

const LogoutBtn = styled.TouchableOpacity`
  border: 1px solid ${(props) => props.theme.greenActColor};
  border-radius: 8px;
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 8px;
`;

const LogoutText = styled.Text`
  padding: 4px 8px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${(props) => props.theme.greenActColor};
`;

const MyFeedBtn = styled.TouchableOpacity`
  border-radius: 8px;
  background-color: ${(props) => props.theme.greenActColor};
  margin-bottom: 8px;
`;

const MyFeedText = styled.Text`
  padding: 4px 8px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  color: ${(props) => props.theme.whiteColor};
`;
// Container Top
// Container GTF
const GTFContainer = styled.View`
  margin-bottom: 8px;
`;
const GTFCounterWrap = styled.View`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 16px;
`;

// Container Main
const MainContainer = styled.View`
  margin-bottom: 8px;
`;

const BoardLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.grayInactColor};
`;

// Container Bottom
const BottomContainer = styled.View``;

export default function MyProfile({ navigation }: any) {
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDark = useColorScheme() === "dark";
  const { data } = useMe();

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => {
        return (
          <MyPageTitleWrap>
            <MyPageTitle>마이페이지</MyPageTitle>
          </MyPageTitleWrap>
        );
      },
      headerRight: () => {
        return (
          <EditWrap>
            <EditBtn>
              <MaterialCommunityIcons
                name="cog-outline"
                size={24}
                color={isDark ? "d2dae2" : "1e272e"}
              />
            </EditBtn>
          </EditWrap>
        );
      },
    });
  }, []);

  return (
    <ProfileContainer>
      <ProfilePrivacyInfo>
        <ProfileImageNameWrap>
          <ProfileImageWrap>
            <ProfileImage
              source={
                data?.me?.avatar === null
                  ? require(`../../assets/emptyAvatar.png`)
                  : { uri: data?.me?.avatar }
              }
            />
          </ProfileImageWrap>
          <ProfileName>{data?.me?.username}</ProfileName>
        </ProfileImageNameWrap>
        <ProfileBtnWrap>
          {isLoggedIn ? (
            <>
              <MyFeedBtn
                onPress={() =>
                  navigation.navigate("Profile", {
                    id: data?.me?.id,
                    username: data?.me?.username,
                  })
                }
              >
                <MyFeedText>내 피드</MyFeedText>
              </MyFeedBtn>
              <LogoutBtn
                onPress={() => {
                  cache.gc();
                  cache.evict({ id: `User:${data?.me?.username}` });
                  logUserOut();
                }}
              >
                <LogoutText>로그아웃</LogoutText>
              </LogoutBtn>
            </>
          ) : (
            <LogoutBtn
              onPress={() => {
                navigation.navigate("LoggedOutNav");
              }}
            >
              <LogoutText>로그인</LogoutText>
            </LogoutBtn>
          )}
        </ProfileBtnWrap>
      </ProfilePrivacyInfo>
      <GTFContainer>
        <GTFCounterWrap>
          <MyProfileCount name={"내 그룹"} count={data?.me?.groupCount} />
          <MyProfileCount name={"내 튜터"} count={data?.me?.tutorCount} />
          <MyProfileCount name={"내 시설 예약"} count={0} />
        </GTFCounterWrap>
      </GTFContainer>
      <MainContainer>
        <ProfileMenu
          title={"튜터 신청"}
          disc={"튜터가 되어보아요."}
          navi={"AddTutor"}
        />
        <BoardLine />
      </MainContainer>
      <BottomContainer>
        <ProfileMenu title={"공지사항"} navi={"AdminNotice"} />
        <BoardLine />
        <ProfileMenu title={"FAQ"} navi={"AdminFaq"} />
        <BoardLine />
        <ProfileMenu
          title={"문의확인"}
          disc={"나의 튜터에 온 문의를 확인합니다."}
          navi={""}
        />
        <BoardLine />
        <ProfileMenu
          title={"내 문의"}
          disc={"내가 문의한 내역을 확인합니다."}
          navi={""}
        />
        <BoardLine />
      </BottomContainer>
    </ProfileContainer>
  );
}
