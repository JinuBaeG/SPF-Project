import React, { RefObject, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../components/auth/AuthShared";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { gql, useMutation } from "@apollo/client";
import { logUserIn, onPressGoogleBtn, signInWithKakao } from "../apollo";
import { useColorScheme } from "react-native";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";

const LOG_IN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;

export default function Login({ navigation, route: { params } }: any) {
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

  useEffect(() => {
    register("username", { required: true });
    register("password", { required: true });
  }, [register]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "126129061327-f509efju0jqkqbd54ccldv2nqe9dg95k.apps.googleusercontent.com",
    });
  }, []);

  const isDark = useColorScheme() === "dark";

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
        text={"Log In"}
        disabled={!watch("username") || !watch("password")}
        loading={loading}
        onPress={handleSubmit(onValid)}
      />
      <AuthButton
        text={"Kakao Log In"}
        loading={loading}
        onPress={signInWithKakao}
      />
      <GoogleSigninButton onPress={() => onPressGoogleBtn()} />
    </AuthLayout>
  );
}
