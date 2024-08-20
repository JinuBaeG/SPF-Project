import React, { RefObject, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { TextInput } from "../components/auth/AuthShared";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { Alert } from "react-native";

const LOG_IN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
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
      email: params?.email,
    },
  });

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
    register("email", { required: true });
    register("password", { required: true });
  }, [register]);

  return (
    <AuthLayout>
      <TextInput
        value={watch("email")}
        placeholder="이메일"
        placeholderTextColor={"rgba(0, 0, 0, 0.8)"}
        keyboardType="email-address"
        returnKeyType="next"
        lastOne={false}
        autoCapitalize="none"
        onSubmitEditing={() => onFocusNext(passwordRef)}
        onChangeText={(text: string) => setValue("email", text)}
      />
      <TextInput
        value={watch("password")}
        ref={passwordRef}
        placeholder="비밀번호"
        placeholderTextColor={"rgba(0, 0, 0, 0.8)"}
        secureTextEntry
        returnKeyType="done"
        lastOne={true}
        onSubmitEditing={handleSubmit(onValid)}
        onChangeText={(text: string) => setValue("password", text)}
      />
      <AuthButton
        text={"로그인"}
        disabled={!watch("email") || !watch("password")}
        loading={loading}
        onPress={handleSubmit(onValid)}
        separate={"normal"}
      />
    </AuthLayout>
  );
}
