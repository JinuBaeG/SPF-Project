import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import { useColorScheme, useWindowDimensions } from "react-native";

type TutorCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "TutorDetail"
>;

const TutorListContainer = styled.TouchableOpacity`
  padding: 16px;
  flex-direction: row;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const TutorListImage = styled.Image`
  padding: 16px;
  width: 108px;
  height: 104px;
  border-radius: 8px;
`;

const TutorListInfoWrap = styled.View`
  padding: 4px 16px;
  justify-content: flex-start;
  align-items: flex-start;
`;
const TutorListTitleWrap = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const TutorListTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

const TutorListEvent = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
`;

const TutorListPoint = styled.View`
  width: 1px;
  height: 1px;
  background-color: ${(props) => props.theme.textColor};
  margin: 4px;
`;

const TutorListMember = styled.View`
  flex-direction: row;
`;

const TutorListUserCount = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
`;

const TutorListDisc = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
  margin: 8px 0;
`;

const TutorTag = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
`;

const TutorTagName = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  margin-right: 4px;
  margin-bottom: 4px;
`;

export default function TutorList({
  id,
  name,
  tutorSportsEvent,
  discription,
  userCount,
  maxMember,
  tutorTag,
  sidoName,
  gusiName,
  dongEubMyunName,
  riName,
  roadName,
  buildingNumber,
  address,
  addrRoad,
  activeArea,
  areaLatitude,
  areaLongitude,
  zipcode,
  tutorImage,
}: any) {
  const navigation = useNavigation<TutorCompNavigationProps>();
  const isDark = useColorScheme() === "dark";
  const { width, height } = useWindowDimensions();

  return (
    <TutorListContainer
      onPress={() =>
        navigation.navigate("TutorDetail", {
          id,
        })
      }
    >
      <TutorListImage
        source={
          tutorImage !== null
            ? { uri: tutorImage.imagePath }
            : require("../../assets/emptyGroup.png")
        }
      />
      <TutorListInfoWrap style={{ width: width - 148 }}>
        <TutorListTitleWrap>
          <TutorListTitle>{name}</TutorListTitle>
          {tutorSportsEvent.map((item: any, index: number) => {
            return (
              <>
                <TutorListEvent key={item.id}>{item.name}</TutorListEvent>

                {tutorSportsEvent.length - 1 === index ? null : (
                  <TutorListPoint />
                )}
              </>
            );
          })}

          <TutorListMember>
            <Ionicons
              name="people-outline"
              size={12}
              color={isDark ? "white" : "black"}
              style={{ marginHorizontal: 4 }}
            />
            <TutorListUserCount>
              {userCount} / {maxMember}
            </TutorListUserCount>
          </TutorListMember>
        </TutorListTitleWrap>
        <TutorListDisc style={{ width: width - 148 }}>
          {discription}
        </TutorListDisc>
        <TutorTag style={{ width: width - 148 }}>
          {tutorTag.map((item: any) => {
            return <TutorTagName key={item.id}>{item.name}</TutorTagName>;
          })}
        </TutorTag>
      </TutorListInfoWrap>
    </TutorListContainer>
  );
}
