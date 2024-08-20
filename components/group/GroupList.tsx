import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import { isLoggedInVar } from "../../apollo";
import { useReactiveVar } from "@apollo/client";
import { Image, useColorScheme, useWindowDimensions } from "react-native";

type GroupCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "GroupDetail"
>;

const GroupListContainer = styled.TouchableOpacity`
  padding: 16px;
  flex-direction: row;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const GroupListImage = styled.Image`
  padding: 16px;
  width: 108px;
  height: 104px;
  border-radius: 8px;
`;

const GroupListInfoWrap = styled.View`
  padding: 4px 16px;
  justify-content: flex-start;
  align-items: flex-start;
`;
const GroupListTitleWrap = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const GroupListTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  font-weight: 600;
  margin-right: 8px;
`;

const GroupListEvent = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
`;

const GroupListPoint = styled.View`
  width: 1px;
  height: 1px;
  background-color: ${(props) => props.theme.textColor};
  margin: 4px;
`;

const GroupListMember = styled.View`
  flex-direction: row;
  align-items: center;
`;

const GroupListUserCount = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
`;

const GroupListDisc = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
  margin: 8px 0;
`;

const GroupTag = styled.View`
  flex-wrap: wrap;
  flex-direction: row;
`;

const GroupTagName = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 300;
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  margin-right: 4px;
  margin-bottom: 4px;
`;

export default function GroupList({
  id,
  name,
  sportsEvent,
  discription,
  userCount,
  maxMember,
  groupTag,
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
  groupImage,
}: any) {
  const navigation = useNavigation<GroupCompNavigationProps>();
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  const isDark = useColorScheme() === "dark";
  const { width, height } = useWindowDimensions();

  return (
    <GroupListContainer
      style={{ width }}
      onPress={() => {
        if (isLoggedIn) {
          navigation.navigate("GroupDetail", {
            id,
          });
        } else {
          navigation.navigate("LoggedOutNav");
        }
      }}
    >
      <GroupListImage
        source={
          groupImage !== null
            ? { uri: groupImage.imagePath }
            : require("../../assets/emptyGroup.png")
        }
      />
      <GroupListInfoWrap style={{ width: width - 148 }}>
        <GroupListTitleWrap>
          <GroupListTitle>{name}</GroupListTitle>
          <GroupListEvent>{sportsEvent}</GroupListEvent>
          <GroupListPoint />
          <GroupListMember>
            <Ionicons
              name="people-outline"
              size={12}
              color={"black"}
              style={{ marginHorizontal: 4 }}
            />
            <GroupListUserCount>
              {userCount} / {maxMember}
            </GroupListUserCount>
          </GroupListMember>
        </GroupListTitleWrap>
        <GroupListDisc style={{ width: width - 148 }} numberOfLines={2}>
          {discription}
        </GroupListDisc>
        <GroupTag style={{ width: width - 148 }}>
          {groupTag.map((item: any) => {
            return <GroupTagName key={item.id}>{item.name}</GroupTagName>;
          })}
        </GroupTag>
      </GroupListInfoWrap>
    </GroupListContainer>
  );
}
