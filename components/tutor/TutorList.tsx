import React, { useEffect } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";

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
  border: 1px solid black;
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
  color: ${(props) => props.theme.blackColor};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

const TutorListEvent = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
  font-weight: 300;
`;

const TutorListPoint = styled.View`
  width: 1px;
  height: 1px;
  background-color: ${(props) => props.theme.grayInactColor};
  margin: 4px;
`;

const TutorListMember = styled.View`
  flex-direction: row;
`;

const TutorListUserCount = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
  font-weight: 300;
`;

const TutorListDisc = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  font-size: 12px;
  font-weight: 300;
  margin: 8px 0;
`;

export default function TutorList({
  id,
  name,
  sportsEvent,
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

  return (
    <TutorListContainer
      onPress={() =>
        navigation.navigate("TutorDetail", {
          id,
        })
      }
    >
      <TutorListImage source={{ uri: tutorImage }} />
      <TutorListInfoWrap>
        <TutorListTitleWrap>
          <TutorListTitle>{name}</TutorListTitle>
          <TutorListEvent>{sportsEvent}</TutorListEvent>
          <TutorListPoint />
          <TutorListMember>
            <Ionicons name="people-outline" size={12} />
            <TutorListUserCount>
              {userCount} / {maxMember}
            </TutorListUserCount>
          </TutorListMember>
        </TutorListTitleWrap>
        <TutorListDisc>{discription}</TutorListDisc>
      </TutorListInfoWrap>
    </TutorListContainer>
  );
}
