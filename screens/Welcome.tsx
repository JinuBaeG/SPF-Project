import React, { RefObject, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
} from "react-native";
import styled from "styled-components/native";
import { colors } from "../color";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { useForm } from "react-hook-form";
import {
  logUserIn,
  onAppleButtonPress,
  onPressGoogleBtn,
  signInWithKakao,
} from "../apollo";
import { gql, useMutation, useQuery } from "@apollo/client";
import NaverLogin, {
  GetProfileResponse,
  NaverLoginResponse,
} from "@react-native-seoul/naver-login";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Modal from "react-native-modal";
import RenderHTML from "react-native-render-html";
import { Ionicons } from "@expo/vector-icons";

const CREATE_NAVER_ACCOUNT_MUTATION = gql`
  mutation naverAccount(
    $phoneNumber: String!
    $username: String!
    $email: String!
    $password: String!
    $interlock: String
    $uid: String
    $privacyAccess: Boolean
    $usetermAccess: Boolean
  ) {
    naverAccount(
      phoneNumber: $phoneNumber
      username: $username
      email: $email
      password: $password
      interlock: $interlock
      uid: $uid
      privacyAccess: $privacyAccess
      usetermAccess: $usetermAccess
    ) {
      ok
      error
    }
  }
`;

const SEE_CONFIG_QUERY = gql`
  query seeConfig {
    seeConfig {
      id
      privacyTerms
      gpsTerms
      useTerms
    }
  }
`;

const LOG_IN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      error
    }
  }
`;

const LOGIN_CHECK = gql`
  mutation loginCheck(
    $uid: String
    $token: String
    $email: String
    $interlock: String
  ) {
    loginCheck(uid: $uid, token: $token, email: $email, interlock: $interlock) {
      ok
      token
      uid
      email
      interlock
    }
  }
`;

const iosKeys = {
  consumerKey: `${process.env.NAVER_LOGIN_API_KEY}`,
  consumerSecret: `${process.env.NAVER_LOGIN_API_SECRET_KEY}`,
  appName: "체육마을",
  serviceUrlScheme: "com.brandus.cheyookmaeul", // only for iOS
};

const androidKeys = {
  consumerKey: `${process.env.NAVER_LOGIN_API_KEY}`,
  consumerSecret: `${process.env.NAVER_LOGIN_API_SECRET_KEY}`,
  appName: "체육마을",
};

const initials = Platform.OS === "ios" ? iosKeys : androidKeys;

const LoginLink = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
  text-align: center;
`;

const LoginLinkBtn = styled.TouchableOpacity`
  background-color: "#01aa73";
  padding: 12px 8px;
  border-radius: 4px;
  width: 100%;
  border: 1px solid #ccc;
`;

const FindAccountBtn = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
`;

const FindAccountText = styled.Text`
  color: ${(props) => props.theme.greenActColor};
  font-weight: 600;
  text-align: center;
  padding: 8px;
  text-algin: left;
`;

const AccessContainer = styled.View`
  flex: 0.5;
  background-color: ${(props) => props.theme.greenActColor};
  border-radius: 8px;
`;

const AccessTextContainer = styled.View`
  padding: 16px;
  background-color: ${(props) => props.theme.greenActColor};
`;

const AccessTextTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: ${(props) => props.theme.whiteColor};
`;

const AccessTextContents = styled.ScrollView`
  height: 25%;
  border-radius: 8px;
  padding: 8px;
  background-color: ${(props) => props.theme.whiteColor};
`;

const AccessButton = styled.TouchableOpacity`
  margin-top: 8px;
  flex-direction: row;
`;

const AccessButtonText = styled.Text`
  color: ${(props) => props.theme.whiteColor};
  font-weight: 600;
  margin-left: 4px;
`;

export default function Welcome({ navigation, route }: any) {
  const goToCreateAccount = () => {
    navigation.navigate("CreateAccount", { interlock: "일반" });
  };
  const goToLogin = () => {
    navigation.navigate("Login");
  };
  const goToFindAccount = () => {
    navigation.navigate("FindAccount", {
      infoText: "계정을 찾기 위해 이메일 주소를 입력해주세요.",
      previousScreen: route.name,
    });
  };

  const passwordRef: React.MutableRefObject<null> = useRef(null);

  const onCompleted = async (data: any) => {
    const {
      login: { ok, token, error },
    } = data;

    if (error) {
      Alert.alert(error);
    }

    if (ok) {
      await logUserIn(token);
      navigation.reset({ routes: [{ name: "Tabs" }] });
    }
  };

  const onLoginCheckCompleted = async (data: any) => {
    const {
      loginCheck: { ok, uid, email, phoneNumber, token, interlock },
    } = data;

    if (ok) {
      await logUserIn(token);
      navigation.reset({ routes: [{ name: "Tabs" }] });
    } else {
      if (interlock === "naver") {
        toggleModal();
      } else {
        navigation.navigate("CreateAccount", {
          uid,
          email,
          phoneNumber,
          interlock,
        });
      }
    }
  };

  const [loginCheckMutation] = useMutation(LOGIN_CHECK, {
    onCompleted: onLoginCheckCompleted,
  });

  // 네이버 로그인 - 시작
  const [naverAuth, setNaverAuth] = useState(false);
  const [naverProfile, setNaverProfile] = useState(false);

  const [success, setSuccessResponse] =
    useState<NaverLoginResponse["successResponse"]>();
  const [failure, setFailureResponse] =
    useState<NaverLoginResponse["failureResponse"]>();
  const [getProfileRes, setGetProfileRes] = useState<GetProfileResponse>();

  const onNaverLogin = async () => {
    const { failureResponse, successResponse } = await NaverLogin.login(
      initials
    );

    setSuccessResponse(successResponse);
    setFailureResponse(failureResponse);
    if (successResponse) {
      setNaverAuth(!naverAuth);
    } else {
      onNaverLogin();
    }
  };

  const getNaverProfile = async () => {
    try {
      const profileResult = await NaverLogin.getProfile(success!.accessToken);
      setGetProfileRes(profileResult);
    } catch (e) {
      setGetProfileRes(undefined);
    }

    setNaverProfile(!naverProfile);
  };

  useEffect(() => {
    if (naverAuth) {
      setTimeout(() => getNaverProfile(), 1000);
    }
  }, [naverAuth]);

  useEffect(() => {
    if (naverProfile) {
      const phoneNumber = getProfileRes?.response.mobile?.replace(/-/g, "");

      setValue("username", getProfileRes?.response.name);
      setValue("phoneNumber", phoneNumber);
      setValue("password", phoneNumber);
      setValue("email", getProfileRes?.response.email);
      setValue("interlock", "naver");
      setValue("uid", getProfileRes?.response.id);

      if (getProfileRes) {
        loginCheckMutation({
          variables: {
            email: getValues("email"),
            phoneNumber: getValues("phoneNumber"),
            uid: getValues("uid"),
            interlock: "naver",
          },
        });
      }
    }
  }, [naverProfile]);

  // 회원가입 완료 후 처리
  const onCompletedNaverAccount = async (data: any) => {
    const {
      naverAccount: { ok, error },
    } = data;

    if (ok) {
      await logUserIn(error);
      navigation.reset({ routes: [{ name: "Tabs" }] });
    } else {
      if (error) {
        Alert.alert(error);
      }
    }
  };

  // 회원가입 처리
  const [createNaverAccountMutation, { loading: naverAccountLoading }] =
    useMutation<any>(CREATE_NAVER_ACCOUNT_MUTATION, {
      onCompleted: onCompletedNaverAccount,
    });

  // 네이버 로그인 - 끝

  const KakaoLogin = async () => {
    const { email, uid, phoneNumber, token }: any = await signInWithKakao();

    loginCheckMutation({
      variables: {
        email,
        phoneNumber,
        uid: uid.toString(),
        token,
        interlock: "kakao",
      },
    });
  };

  const GoogleLogin = async () => {
    const { email, uid, phoneNumber, token }: any = await onPressGoogleBtn();

    loginCheckMutation({
      variables: {
        email,
        phoneNumber,
        uid: uid.toString(),
        token,
        interlock: "google",
      },
    });
  };

  const AppleLogin = async () => {
    const { email, uid, phoneNumber, token }: any = await onAppleButtonPress();

    loginCheckMutation({
      variables: {
        email,
        phoneNumber,
        uid,
        token,
        interlock: "apple",
      },
    });
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "126129061327-2hmgnikf1mkifv3s9ad3fgfmn4ag3a92.apps.googleusercontent.com",
    });
  }, []);

  const isDark = useColorScheme() === "dark";

  const platform = Platform.OS;

  const { data: termsData } = useQuery(SEE_CONFIG_QUERY, {
    fetchPolicy: "cache-and-network",
  });

  const { width } = useWindowDimensions();
  const useTermsContents = { html: termsData?.seeConfig.useTerms };
  const privacyTermsContents = { html: termsData?.seeConfig.privacyTerms };

  const [useTermsAccess, setUseTermsAccess] = useState(false);
  const [privacyTermsAccess, setPrivacyTermsAccess] = useState(false);
  const [allTermsAccess, setAllTermsAccess] = useState(false);

  const useTermToggle = () => {
    setUseTermsAccess(!useTermsAccess);
    setValue("usetermAccess", !useTermsAccess);
  };

  const privacyTermToggle = () => {
    setPrivacyTermsAccess(!privacyTermsAccess);
    setValue("privacyAccess", !privacyTermsAccess);
  };

  const allTermToggle = () => {
    setUseTermsAccess(!useTermsAccess);
    setValue("usetermAccess", !useTermsAccess);
    setPrivacyTermsAccess(!privacyTermsAccess);
    setValue("privacyAccess", !privacyTermsAccess);
    setAllTermsAccess(!allTermsAccess);
  };

  useEffect(() => {
    if (useTermsAccess && privacyTermsAccess) {
      setAllTermsAccess(true);
    } else {
      setAllTermsAccess(false);
    }
  }, [useTermsAccess, privacyTermsAccess]);

  const deviceWidth = Dimensions.get("window").width;
  const deviceHeight =
    Platform.OS === "ios"
      ? Dimensions.get("window").height
      : require("react-native-extra-dimensions-android").get(
          "REAL_WINDOW_HEIGHT"
        );
  const [visibleModal, setVisibleModal] = useState(false);

  // 회원가입을 위한 기본 정보 입력 세팅
  const { register, handleSubmit, setValue, watch, getValues } = useForm();

  // 회원가입 절차 중 약관 모달창 토글
  const toggleModal = () => setVisibleModal(!visibleModal);

  // 회원가입 완료처리를 위한 호출
  const onValidNaver = (data: any) => {
    toggleModal();
    if (!naverAccountLoading) {
      createNaverAccountMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  // 회원가입 정보 폼 세팅
  useEffect(() => {
    register("phoneNumber");
    register("username");
    register("email");
    register("password");
    register("interlock");
    register("uid");
    register("privacyAccess");
    register("usetermAccess");
  }, [register]);

  return (
    <AuthLayout>
      <AuthButton
        separate={"normal"}
        onPress={goToCreateAccount}
        disabled={false}
        text={"회원가입"}
      />

      <AuthButton
        text={"네이버로 로그인"}
        onPress={async () => await onNaverLogin()}
        style={{ width: "100%" }}
        separate={"naver"}
      />

      <AuthButton
        text={"카카오로 로그인"}
        onPress={() => KakaoLogin()}
        separate={"kakao"}
      />
      {platform === "ios" ? (
        <AuthButton
          text={"애플로 로그인"}
          onPress={() => {
            AppleLogin();
          }}
          separate={"apple"}
        />
      ) : null}

      <AuthButton
        text={"구글로 로그인"}
        onPress={() => GoogleLogin()}
        style={{ width: "100%" }}
        separate={"google"}
      />
      <LoginLinkBtn onPress={goToLogin}>
        <LoginLink>로그인</LoginLink>
      </LoginLinkBtn>
      <FindAccountBtn onPress={goToFindAccount}>
        <FindAccountText>계정 찾기</FindAccountText>
      </FindAccountBtn>
      <AccessContainer>
        <Modal
          isVisible={visibleModal}
          deviceHeight={deviceHeight}
          deviceWidth={deviceWidth}
          onBackdropPress={() => setVisibleModal(!visibleModal)}
        >
          <AccessTextContainer>
            <AccessTextTitle>체육마을 이용약관</AccessTextTitle>
            <AccessTextContents showsVerticalScrollIndicator={true}>
              <RenderHTML contentWidth={width} source={useTermsContents} />
            </AccessTextContents>
            <AccessButton
              onPress={() => {
                useTermToggle();
              }}
            >
              <Ionicons
                name={useTermsAccess ? "checkbox-outline" : "square-outline"}
                color={"white"}
                size={16}
              />
              <AccessButtonText>
                체육마을 이용약관 내용에 동의합니다.
              </AccessButtonText>
            </AccessButton>
          </AccessTextContainer>
          <AccessTextContainer>
            <AccessTextTitle>개인정보처리방침 약관</AccessTextTitle>
            <AccessTextContents showsVerticalScrollIndicator={true}>
              <RenderHTML contentWidth={width} source={privacyTermsContents} />
            </AccessTextContents>
            <AccessButton
              onPress={() => {
                privacyTermToggle();
              }}
            >
              <Ionicons
                name={
                  privacyTermsAccess ? "checkbox-outline" : "square-outline"
                }
                size={16}
                color={"white"}
              />
              <AccessButtonText>
                체육마을 개인정보처리방침 내용에 동의합니다.
              </AccessButtonText>
            </AccessButton>
            <AccessButton
              onPress={() => {
                allTermToggle();
              }}
            >
              <Ionicons
                name={allTermsAccess ? "checkbox-outline" : "square-outline"}
                size={16}
                color={"white"}
              />
              <AccessButtonText>전체 내용에 동의합니다.</AccessButtonText>
            </AccessButton>
          </AccessTextContainer>
          <AuthButton
            onPress={handleSubmit(onValidNaver)}
            text={"확인"}
            disabled={!watch("privacyAccess") || !watch("usetermAccess")}
          />
        </Modal>
      </AccessContainer>
    </AuthLayout>
  );
}
