import { gql, useMutation } from "@apollo/client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useColorScheme } from "react-native";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";
import { TextInput } from "../components/auth/AuthShared";
import styled from "styled-components/native";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount(
    $phoneNumber: String!
    $username: String!
    $email: String!
    $password: String!
  ) {
    createAccount(
      phoneNumber: $phoneNumber
      username: $username
      email: $email
      password: $password
    ) {
      ok
      error
    }
  }
`;

const PhoneCheck = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
`;

const PhoneCheckBtn = styled.TouchableOpacity<{ certified: Boolean }>`
  padding: 16px 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  width: 36%;
  border: 1px solid rgba(20, 20, 20, 0.2);
  opacity: ${(props) => (props.certified ? "0.5" : "1")};
`;

const PhoneCheckText = styled.Text`
  text-align: center;
  font-weight: 600;
`;

export default function CreateAccount({ navigation }: any) {
  const onCompleted = (data: any) => {
    const {
      createAccount: { ok, error },
    } = data;
    const { username, password } = getValues();

    if (ok) {
      navigation.navigate("Login", { username, password });
    }

    if (error) {
      alert(error);
    }
  };
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const [createAccountMutation, { loading }] = useMutation(
    CREATE_ACCOUNT_MUTATION,
    { onCompleted }
  );
  const phoneNumberRef: React.MutableRefObject<null> = useRef(null);
  const emailRef: React.MutableRefObject<null> = useRef(null);
  const passwordRef: React.MutableRefObject<null> = useRef(null);

  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  const onValid = (data: any) => {
    if (!loading) {
      createAccountMutation({
        variables: {
          ...data,
        },
      });
    }
  };

  useEffect(() => {
    register("phoneNumber", { required: true });
    register("username", { required: true });
    register("email", { required: true });
    register("password", { required: true });
  }, [register]);

  const isDark = useColorScheme() === "dark";

  const [certified, setCertified] = useState(false);

  return (
    <AuthLayout>
      <TextInput
        placeholder="이름 또는 닉네임"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(emailRef)}
        onChangeText={(text: string) => setValue("username", text)}
      />
      <TextInput
        ref={emailRef}
        placeholder="이메일"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        keyboardType="email-address"
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(passwordRef)}
        onChangeText={(text: string) => setValue("email", text)}
      />
      <TextInput
        ref={passwordRef}
        placeholder="비밀번호"
        placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
        secureTextEntry
        returnKeyType="next"
        lastOne={false}
        isDark={isDark}
        onSubmitEditing={() => onFocusNext(phoneNumberRef)}
        onChangeText={(text: string) => setValue("password", text)}
      />
      <PhoneCheck>
        <TextInput
          ref={phoneNumberRef}
          placeholder="휴대폰번호"
          placeholderTextColor={isDark ? "rgba(255, 255, 255, 0.8)" : "#888888"}
          returnKeyType="join"
          lastOne={false}
          isDark={isDark}
          onSubmitEditing={handleSubmit(onValid)}
          onChangeText={(text: string) => setValue("phoneNumber", text)}
          style={{ width: "62%" }}
        />
        <PhoneCheckBtn
          onPress={() => {
            setCertified(!certified);
          }}
          disabled={certified}
          certified={certified}
        >
          <PhoneCheckText>인증</PhoneCheckText>
        </PhoneCheckBtn>
      </PhoneCheck>
      <AuthButton
        onPress={handleSubmit(onValid)}
        text={"회원가입"}
        loading={loading}
        disabled={
          !watch("phoneNumber") ||
          !watch("username") ||
          !watch("email") ||
          !watch("password")
        }
      />
    </AuthLayout>
  );
}
