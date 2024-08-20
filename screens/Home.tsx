import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import HeaderNav from "../components/nav/HeaderNav";
import VirtualizedView from "../components/shared/VirtualizedView";
import useSportsEventMain from "../hooks/useSportsEventMain";
import HomeMainBanner from "../components/home/HomeMainBanner";
import HomeNewsBanner from "../components/home/HomeNewsBanner";
import HeaderFilter from "../components/nav/HeaderFilter";
import ScreenLayout from "../components/ScreenLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { OPER_URL } from "@env";

const HomeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  margin: ${(props) => props.theme.size16};
  margin-bottom: 24px;
  justify-content: center;
  align-items: center;
`;

const SportsEventArea = styled.SafeAreaView`
  padding: 16px;
`;

const SportsEvent = styled.TouchableOpacity`
  border-radius: 8px;
  align-items: center;
  margin: 4px;
  justify-content: center;
  align-items: center;
`;
const SportsIcon = styled.Image`
  width: 100%;
  height: 60px;
  margin: 8px;
`;

const SportsEventText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.grayColor};
  margin-bottom: 8px;
`;

const HomeBottomButtonWrap = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const HomeBottomButton = styled.TouchableOpacity`
  margin: 4px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

export default function Home({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(0);
  const data = useSportsEventMain(undefined);

  const renderIcon = ({ item: sports, index }: any) => {
    return (
      <SportsEvent
        key={index}
        onPress={() => {
          navigation.navigate("SportsSelectSearch", {
            sportsEvent: sports.name,
          });
        }}
        style={{
          width: width / 4 - 16,
          height: width / 4,
          padding: 8,
          backgroundColor: "#fff",
          borderColor: "#ccc",
          borderWidth: 1,
        }}
      >
        <SportsIcon
          source={{ uri: sports.imagePath }}
          resizeMode="contain"
          style={{ width: width / 8, height: width / 8 }}
        />
        <SportsEventText>{sports.name}</SportsEventText>
      </SportsEvent>
    );
  };

  const MessageButton = () => {
    return <HeaderNav navigation={navigation} />;
  };

  const FilterButton = () => {
    return <HeaderFilter navigation={navigation} />;
  };

  useEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: FilterButton,
      headerRight: MessageButton,
    });
  }, []);

  const [mainBannerLoading, setMainBannerLoading] = useState(false);
  const [newsBannerLoading, setNewsBannerLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);

  useEffect(() => {
    if ((mainBannerLoading && newsBannerLoading) == false) {
      setScreenLoading(false);
    } else {
      setScreenLoading(true);
    }
  }, []);

  return (
    <VirtualizedView>
      <ScreenLayout loading={screenLoading}>
        <HomeContainer>
          <HomeMainBanner setMainBannerLoading={setMainBannerLoading} />
          <SportsEventArea>
            <FlatList
              style={{
                width: "100%",
                padding: 0,
              }}
              numColumns={4}
              showsVerticalScrollIndicator={false}
              data={data}
              keyExtractor={(sports) => "" + sports.id}
              renderItem={renderIcon}
              initialNumToRender={8}
            />
          </SportsEventArea>

          <HomeBottomButtonWrap>
            <HomeBottomButton
              onPress={() => navigation.navigate("ContestList")}
              style={{
                width: width / 2 - 24,
                height: width / 3,
                backgroundColor: "#fff",
                borderColor: "#ccc",
                borderWidth: 1,
              }}
            >
              <SportsIcon
                source={{
                  uri:
                    process.env.NODE_ENV === "development"
                      ? "http://localhost:4000/uploads/free-icon-trophy-9350653.png"
                      : "http://ec2-13-125-37-103.ap-northeast-2.compute.amazonaws.com:4000/uploads/free-icon-trophy-9350653.png",
                }}
                resizeMode="contain"
                style={{ width: width / 4 - 32, height: width / 4 - 32 }}
              />
              <SportsEventText>대회</SportsEventText>
            </HomeBottomButton>
            <HomeBottomButton
              style={{
                width: width / 2 - 24,
                height: width / 3,
                backgroundColor: "#fff",
                borderColor: "#ccc",
                borderWidth: 1,
              }}
            >
              <SportsIcon
                source={{
                  uri:
                    process.env.NODE_ENV === "development"
                      ? "http://localhost:4000/uploads/free-icon-seminar-6831405.png"
                      : "http://ec2-13-125-37-103.ap-northeast-2.compute.amazonaws.com:4000/uploads/free-icon-seminar-6831405.png",
                }}
                resizeMode="contain"
                style={{ width: width / 4 - 32, height: width / 4 - 32 }}
              />
              <SportsEventText>세미나</SportsEventText>
            </HomeBottomButton>
          </HomeBottomButtonWrap>
        </HomeContainer>
      </ScreenLayout>
    </VirtualizedView>
  );
}
