import React, { RefObject, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../components/auth/AuthShared";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  logUserIn,
  onAppleButtonPress,
  onPressGoogleBtn,
  signInWithKakao,
} from "../apollo";
import { Platform, useColorScheme } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const LOG_IN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

const LOGIN_CHECK = gql`
  query loginCheck($uid: String, $interlock: String) {
    loginCheck(uid: $uid, interlock: $interlock) {
      ok
    }
  }
`;

export default function Login({ navigation, route: { params } }: any) {
  const LoginCheck = (uid: string, interlock: string) => {
    const { data } = useQuery(LOGIN_CHECK, {
      variables: {
        uid,
        interlock,
      },
    });

    return data.ok;
  };

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      password: params?.password,
      username: params?.username,
    },
  });
  const passwordRef: React.MutableRefObject<null> = useRef(null);
  const onCompleted = async (data: any) => {
    const {
      login: { ok, token, error },
    } = data;
    if (ok) {
      await logUserIn(token);
      navigation.navigate("Tabs");
    }
    if (error) {
      console.log(error);
    }
  };
  const [loginMutation, { loading }] = useMutation(LOG_IN_MUTATION, {
    onCompleted,
  });
  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  const onValid = (data: any) => {
    if (!loading) {
      loginMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  const KakaoLogin = async () => {
    const { email, uid, token }: any = await signInWithKakao();
    const loginCheck = LoginCheck(uid, "kakao");

    if (loginCheck) {
      await logUserIn(token);
      navigation.navigate("Tabs");
    } else {
      navigation.navigate("CreateAccount", { uid, email });
    }
  };

  const GoogleLogin = async () => {
    const { email, uid, token }: any = await onPressGoogleBtn();

    const loginCheck = LoginCheck(uid, "google");

    if (loginCheck) {
      await logUserIn(token);
      navigation.navigate("Tabs");
    } else {
      navigation.navigate("CreateAccount", { uid, email });
    }
  };

  const AppleLogin = async () => {
    const { email, uid, token }: any = await onAppleButtonPress();

    const loginCheck = LoginCheck(uid, "apple");

    if (loginCheck) {
      await logUserIn(token);
      navigation.navigate("Tabs");
    } else {
      navigation.navigate("CreateAccount", { uid, email });
    }
  };

  useEffect(() => {
    register("username", { required: true });
    register("password", { required: true });
  }, [register]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "126129061327-ee1846j62rtbip9ocbc7acnmmimdk0tm.apps.googleusercontent.com",
    });
  }, []);

  const isDark = useColorScheme() === "dark";

  const platform = Platform.OS;

  return (
    <AuthLayout>
      <TextInput
        value={watch("username")}
        placeholder="User Name"
        placeholderTextColor={
          isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
        }
        isDark={isDark}
        returnKeyType="next"
        lastOne={false}
        autoCapitalize="none"
        onSubmitEditing={() => onFocusNext(passwordRef)}
        onChangeText={(text: string) => setValue("username", text)}
      />
      <TextInput
        value={watch("password")}
        ref={passwordRef}
        placeholder="Password"
        placeholderTextColor={
          isDark ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.8)"
        }
        isDark={isDark}
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text: string) => setValue("password", text)}
      />
      <AuthButton
        text={"로그인"}
        disabled={!watch("username") || !watch("password")}
        loading={loading}
        onPress={handleSubmit(onValid)}
        separate={"normal"}
      />
      <AuthButton
        text={"카카오로 로그인"}
        loading={loading}
        onPress={KakaoLogin}
        separate={"kakao"}
      />
      {platform === "ios" ? (
        <AuthButton
          text={"애플로 로그인"}
          loading={loading}
          onPress={() => {
            AppleLogin();
          }}
          separate={"apple"}
        />
      ) : null}

      <AuthButton
        text={"구글로 로그인"}
        loading={loading}
        onPress={() => GoogleLogin()}
        style={{ width: "100%" }}
        separate={"google"}
      />
    </AuthLayout>
  );
}
