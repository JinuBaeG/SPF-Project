import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../color";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";

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
  border: 1px solid rgba(20, 20, 20, 0.2);
`;

export default function Welcome({ navigation }: any) {
  const goToCreateAccount = () => {
    navigation.navigate("CreateAccount");
  };
  const goToLogin = () => {
    navigation.navigate("Login");
  };
  return (
    <AuthLayout>
      <AuthButton
        separate={"normal"}
        onPress={goToCreateAccount}
        disabled={false}
        text={"회원가입"}
      />
      <LoginLinkBtn onPress={goToLogin}>
        <LoginLink>로그인</LoginLink>
      </LoginLinkBtn>
    </AuthLayout>
  );
}
