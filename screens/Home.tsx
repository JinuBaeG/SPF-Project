import React, { useEffect, useState } from "react";
import { View, Text, useWindowDimensions, FlatList } from "react-native";
import styled from "styled-components/native";
import HeaderNav from "../components/nav/HeaderNav";
import Swiper from "react-native-swiper";
import VirtualizedView from "../components/shared/VirtualizedView";
import useSportsEventMain from "../hooks/useSportsEventMain";

const HomeContainer = styled.SafeAreaView`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  margin: ${(props) => props.theme.size16};
  margin-bottom: 30px;
`;

const HomeMainBanner = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  border-radius: ${(props) => props.theme.size8};
`;

const Banner = styled.Image``;

const SportsEventArea = styled.SafeAreaView`
  align-items: center;
  justify-content: center;
`;

const SportsEvent = styled.View`
  width: 20%;
  height: 60px;
  background-color: ${(props) => props.theme.mainBgColor};
  border-radius: 8px;
  align-items: center;
  margin-bottom: 24px;
`;
const SportsIcon = styled.Image`
  width: 36px;
  height: 36px;
  margin-bottom: 8px;
`;

const SportsEventText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.grayColor};
`;

const ContestContainer = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
`;

const ContestTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
`;

const ContestBannerWrap = styled.View`
  position: relative;
  width: 100%;
  margin: 8px 0;
`;

const ContestBanner = styled.Image``;

const ContestBannerGradient = styled.Image`
  position: absolute;
`;

const ContestText = styled.Text`
  position: absolute;
  bottom: 8px;
  right: 8px;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.whiteColor};
`;

export default function Home({ navigation }: any) {
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height / 4.5);

  const data = useSportsEventMain(undefined);

  const renderIcon = ({ item: sports, index }: any) => {
    return (
      <SportsEvent key={index}>
        <SportsIcon
          source={
            index !== 8 && index !== 9
              ? { uri: sports.imagePath }
              : index !== 8
              ? require("../assets/ALL.png")
              : require("../assets/Contest.png")
          }
          resizeMode="contain"
        />
        <SportsEventText>
          {index !== 8 && index !== 9
            ? sports.name
            : index !== 8
            ? "전체"
            : "대회정보"}
        </SportsEventText>
      </SportsEvent>
    );
  };

  const MessageButton = () => {
    return <HeaderNav navigation={navigation} />;
  };

  useEffect(() => {
    navigation.setOptions({
      title: "홈",
      headerRight: MessageButton,
    });
  }, []);
  return (
    <VirtualizedView>
      <HomeContainer>
        <HomeMainBanner>
          <Swiper
            loop
            horizontal
            showsButtons={false}
            showsPagination={true}
            autoplay={false}
            autoplayTimeout={3.5}
            containerStyle={{
              height: imageHeight,
            }}
            dot={
              <View
                style={{
                  backgroundColor: "rgba(1, 170, 115, 0.4)",
                  width: 5,
                  height: 5,
                  borderRadius: 4,
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 3,
                  marginBottom: 3,
                }}
              />
            }
            activeDot={
              <View
                style={{
                  backgroundColor: "#01aa73",
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  marginLeft: 3,
                  marginRight: 3,
                  marginTop: 3,
                  marginBottom: 3,
                }}
              />
            }
            paginationStyle={{
              bottom: 20,
              left: 20,
              right: undefined,
            }}
          >
            <Banner
              resizeMode="stretch"
              style={{
                width: width - 32,
                height: imageHeight,
              }}
              source={require("../assets/mainBanner.png")}
            />
            <Banner
              resizeMode="stretch"
              style={{
                width: width - 32,
                height: imageHeight,
              }}
              source={require("../assets/mainBanner.png")}
            />
            <Banner
              resizeMode="stretch"
              style={{
                width: width - 32,
                height: imageHeight,
              }}
              source={require("../assets/mainBanner.png")}
            />
          </Swiper>
        </HomeMainBanner>
        <SportsEventArea>
          <FlatList
            style={{
              width: "100%",
              marginTop: 1,
              padding: 16,
            }}
            numColumns={5}
            showsVerticalScrollIndicator={false}
            data={data}
            keyExtractor={(sports) => "" + sports.id}
            renderItem={renderIcon}
            initialNumToRender={10}
          />
        </SportsEventArea>
        <ContestContainer>
          <ContestTitle>대회정보 모아보기</ContestTitle>
          <ContestBannerWrap>
            <ContestBanner source={require("../assets/contestInfo.png")} />
            <ContestBannerGradient source={require("../assets/gradient.png")} />
            <ContestText>강서구체육회 신규동호회 모집혜택 안내</ContestText>
          </ContestBannerWrap>
          <ContestBannerWrap>
            <ContestBanner source={require("../assets/contestInfo.png")} />
            <ContestBannerGradient source={require("../assets/gradient.png")} />
            <ContestText>강서구체육회 신규동호회 모집혜택 안내</ContestText>
          </ContestBannerWrap>
          <ContestBannerWrap>
            <ContestBanner source={require("../assets/contestInfo.png")} />
            <ContestBannerGradient source={require("../assets/gradient.png")} />
            <ContestText>강서구체육회 신규동호회 모집혜택 안내</ContestText>
          </ContestBannerWrap>
        </ContestContainer>
      </HomeContainer>
    </VirtualizedView>
  );
}
