import { gql, useMutation } from "@apollo/client";
import React, { useEffect, useRef } from "react";
import styled from "styled-components/native";
import { colors } from "../../color";
import { useForm } from "react-hook-form";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import DissmissKeyboard from "../../components/DismissKeyboard";
import SelectDropdown from "react-native-select-dropdown";
import { Entypo } from "@expo/vector-icons";

const CREATE_CONTEST_REPORT = gql`
  mutation createContestReport(
    $contestId: String
    $reportType: String
    $reportTitle: String
    $reportDiscription: String
  ) {
    createContestReport(
      contestId: $contestId
      reportType: $reportType
      reportTitle: $reportTitle
      reportDiscription: $reportDiscription
    ) {
      ok
      error
    }
  }
`;

// Styled-Component START
const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.greenInactColor};
  justify-content: space-between;
  padding: 16px;
`;
const InputContainer = styled.View`
  position: relative;
  margin-bottom: 8px;
`;

const TitleContainer = styled.View``;

const Title = styled.TextInput`
  background-color: ${(props) => props.theme.whiteColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;

const DiscContainer = styled.View`
  height: 150px;
  margin-top: 16px;
`;

const Disc = styled.TextInput`
  background-color: ${(props) => props.theme.whiteColor};
  color: black;
  padding: 12px;
  border-radius: 8px;
`;

const HeaderRightText = styled.Text`
  color: ${colors.blue};
  font-size: 16px;
  font-weight: 600;
  margin-right: 16px;
`;
// Styled-Component END

export default function ContestReport({ navigation, route }: any) {
  const categoryData = [
    "버그신고",
    "파트너변경",
    "티어변경",
    "선수신고",
    "기타",
  ];

  const { register, handleSubmit, setValue } = useForm();

  const onCompleted = (data: any) => {
    const {
      createContestReport: { ok, error },
    } = data;

    if (ok) {
      Alert.alert("문의가 접수되었습니다.", "관리자가 확인 후 답변하겠습니다.");
      navigation.goBack();
    }
  };

  const [createContestReportMutation, { loading }] = useMutation(
    CREATE_CONTEST_REPORT,
    { onCompleted }
  );

  const HeaderRight = () => {
    return (
      <TouchableOpacity onPress={handleSubmit(onValid)}>
        <HeaderRightText>완료</HeaderRightText>
      </TouchableOpacity>
    );
  };

  const onValid = (data: any) => {
    createContestReportMutation({
      variables: {
        ...data,
      },
    });
  };

  useEffect(() => {
    register("contestId");
    register("reportType");
    register("reportTitle");
    register("reportDiscription");
  }, [register]);

  useEffect(() => {
    setValue("contestId", route.params.contestId);
  }, []);

  useEffect(() => {
    navigation.setOptions({
      title: "문의하기",
      headerRight: HeaderRight,
    });
  }, []);
  return (
    <DissmissKeyboard>
      <Container>
        <KeyboardAvoidingView
          style={{
            width: "100%",
          }}
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === "ios" ? 150 : -150}
        >
          <InputContainer>
            <SelectDropdown
              data={categoryData}
              defaultButtonText="문의 종류"
              buttonTextStyle={{
                textAlign: "left",
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              rowTextStyle={{
                textAlign: "left",
                paddingHorizontal: 8,
                fontSize: 16,
              }}
              dropdownStyle={{
                borderWidth: 0,
                borderRadius: 8,
              }}
              buttonStyle={{
                width: "100%",
                backgroundColor: "white",
                marginBottom: 8,
                borderRadius: 8,
              }}
              renderDropdownIcon={() => {
                return <Entypo name="chevron-thin-down" size={20} />;
              }}
              dropdownIconPosition={"right"}
              onSelect={(selectedItem, index) => {
                console.log(selectedItem, index);
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                // text represented after item is selected
                // if data array is an array of objects then return selectedItem.property to render after item is selected
                setValue("reportType", selectedItem);
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                // text represented for each item in dropdown
                // if data array is an array of objects then return item.property to represent item in dropdown
                return item;
              }}
            />
            <TitleContainer>
              <Title
                placeholder="제목"
                placeholderTextColor="rgba(0,0,0,0.2)"
                onChangeText={(text: string) => setValue("reportTitle", text)}
              />
            </TitleContainer>
            <DiscContainer>
              <Disc
                placeholder="내용"
                placeholderTextColor="rgba(0,0,0,0.2)"
                onSubmitEditing={handleSubmit(onValid)}
                onChangeText={(text: string) =>
                  setValue("reportDiscription", text)
                }
                style={{ flex: 1, textAlignVertical: "top" }}
                numberOfLines={10}
                maxLength={1000}
                multiline={true}
              />
            </DiscContainer>
          </InputContainer>
        </KeyboardAvoidingView>
      </Container>
    </DissmissKeyboard>
  );
}
