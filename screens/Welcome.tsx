import React from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import { colors } from "../color";
import AuthButton from "../components/auth/AuthButton";
import AuthLayout from "../components/auth/AuthLayout";

const LoginLink = styled.Text`
  color: ${colors.blue};
  font-weight: 600;
  margin-top: 10px;
  text-align: center;
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
        onPress={goToCreateAccount}
        disabled={false}
        text={"Create New Account"}
      />
      <TouchableOpacity onPress={goToLogin}>
        <LoginLink>Log In</LoginLink>
      </TouchableOpacity>
    </AuthLayout>
  );
}
