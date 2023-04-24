import React from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";
import { colors } from "../../color";

const Button = styled.TouchableOpacity<{ disabled: boolean; separate: string }>`
  position: relative;
  background-color: ${(props) =>
    props.separate === "normal"
      ? "#01aa73"
      : props.separate === "kakao"
      ? "#FEE500"
      : props.separate === "google"
      ? "#000000"
      : "#FFFFFF"};
  padding: 12px 8px;
  border-radius: 4px;
  width: 100%;
  opacity: ${(props) => (props.disabled ? "0.5" : "1")};
  margin-bottom: 8px;
  border: 1px solid rgba(20, 20, 20, 0.2);
`;

const ButtonText = styled.Text<{ separate: string }>`
  color: ${(props) =>
    props.separate === "normal" || props.separate === "google"
      ? props.theme.whiteColor
      : props.theme.textColor};
  text-align: center;
  font-weight: 600;
`;

const LoginIcon = styled.Image`
  position: absolute;
  width: 28px;
  height: 28px;
  top: 6px;
  left: 8px;
`;

export default function AuthButton({
  onPress,
  disabled,
  text,
  loading,
  separate,
}: any) {
  return (
    <Button disabled={disabled} onPress={onPress} separate={separate}>
      {loading ? (
        <ActivityIndicator color="white" />
      ) : separate === "kakao" ? (
        <>
          <LoginIcon source={require("../../assets/kakao.png")} />
          <ButtonText separate={separate}>{text}</ButtonText>
        </>
      ) : separate === "apple" ? (
        <>
          <LoginIcon source={require("../../assets/apple.png")} />
          <ButtonText separate={separate}>{text}</ButtonText>
        </>
      ) : separate === "google" ? (
        <>
          <LoginIcon source={require("../../assets/google.png")} />
          <ButtonText separate={separate}>{text}</ButtonText>
        </>
      ) : (
        <>
          <ButtonText separate={separate}>{text}</ButtonText>
        </>
      )}
    </Button>
  );
}
