import { gql, useMutation } from "@apollo/client";
import { LOCAL_URL, OPER_URL } from "@env";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Alert, useColorScheme } from "react-native";
import styled from "styled-components/native";

const EMAIL_CHECK = gql`
  mutation checkEmail($email: String) {
    checkEmail(email: $email) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
  padding-top: 40px;
`;

const InputContainer = styled.View``;

const InputTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const InputDesc = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
`;

const InputPhoneNumber = styled.TextInput`
  padding: 8px;
  background-color: ${(props) => props.theme.blackColor};
  border-radius: 8px;
  margin: 8px 0;
`;

const PhoneCheck = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 8px;
`;

const PhoneCheckBtn = styled.TouchableOpacity<{ certified: Boolean }>`
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
  opacity: ${(props) => (props.certified ? "0.5" : "1")};
  background-color: ${(props) => props.theme.mainBgColor};
`;

const PhoneCheckText = styled.Text`
  text-align: center;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

export default function FindAccount({ navigation, route: { params } }: any) {
  const emailRef: React.MutableRefObject<any> = useRef(null);
  const [email, setEmail] = useState("");
  const [emailEditable, setEmailEditable] = useState(true);
  const [certified, setCertified] = useState(false);
  const [activeCertified, setActiveCertified] = useState(true);
  const [certifiedNumber, setCertifiedNumber] = useState("");
  const [makedCertifiedNumber, setMakedCertifiedNumber] = useState("");
  const [certifiedEditble, setCertifiedEditable] = useState(true);
  const [certifiedComplete, setCertifiedComplete] = useState(false);
  const isDark = useColorScheme() === "dark";

  const makeCertifedNumber = () => {
    const url =
      process.env.NODE_ENV === "development"
        ? `${LOCAL_URL}:4000/api/mailCertified`
        : `${OPER_URL}:4000/api/mailCertified`;
    const response: any = axios({
      method: "GET",
      url: url,
      params: {
        email: `${email}`,
      },
    })
      .then((res) => {
        setMakedCertifiedNumber(res.data.crtNumber);
        setEmailEditable(false);
        setActiveCertified(true);
        setCertified(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onCheckEmailCompleted = (data: any) => {
    const {
      checkEmail: { ok, error },
    } = data;

    if (ok) {
      Alert.alert(
        "가입되지 않은 이메일입니다. ",
        "로그인 초기화면으로 돌아갑니다.",
        [
          {
            text: "예",
            onPress: () => {
              navigation.navigate("Welcome");
            },
          },
        ]
      );
    } else {
      makeCertifedNumber();
      Alert.alert(
        "해당 메일로 인증번호를 발송하였습니다.",
        "받으신 인증번호를 입력해주세요."
      );
    }
  };

  const [checkEmailMutation, { loading: checkPhoneLoading }] = useMutation(
    EMAIL_CHECK,
    {
      onCompleted: onCheckEmailCompleted,
    }
  );

  const checkJoinEmail = () => {
    checkEmailMutation({
      variables: {
        email,
      },
    });
  };

  const checkCertifedNumber = () => {
    if (makedCertifiedNumber === certifiedNumber) {
      navigation.navigate("ChangePassword", {
        email,
        previousScreen: params.previousScreen,
      });
    } else {
      Alert.alert("올바르지 않은 인증번호 입니다.");
      setCertifiedComplete(false);
      setCertifiedEditable(true);
    }
  };

  const checkEmailValid = () => {
    let regEx = new RegExp(
      "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
    );

    let check = regEx.test(email);

    if (check) {
      setActiveCertified(!activeCertified);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      title: "비밀번호 변경",
    });
  }, []);

  return (
    <Container>
      <InputContainer>
        <InputTitle>{params.infoText}</InputTitle>
        <InputPhoneNumber
          ref={emailRef}
          keyboardType="email-address"
          placeholder="메일주소"
          placeholderTextColor={"#888888"}
          returnKeyType="done"
          onChangeText={(text: string) => {
            setEmail(text);
          }}
          onBlur={() => {
            checkEmailValid();
          }}
          editable={emailEditable}
        />
        <PhoneCheckBtn
          onPress={() => {
            checkJoinEmail();
            setCertified(!certified);
            setActiveCertified(true);
          }}
          disabled={false}
          certified={false}
        >
          <PhoneCheckText>인증번호발송</PhoneCheckText>
        </PhoneCheckBtn>
        {certified ? (
          <>
            <InputPhoneNumber
              keyboardType="number-pad"
              placeholder="인증번호입력"
              placeholderTextColor={"#888888"}
              returnKeyType="join"
              onChangeText={(text: string) => {
                setCertifiedNumber(text);
              }}
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
              <PhoneCheckText>인증완료</PhoneCheckText>
            </PhoneCheckBtn>
          </>
        ) : null}
      </InputContainer>
    </Container>
  );
}
