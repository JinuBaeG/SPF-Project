import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from "react-native-nmap";
import styled from "styled-components/native";
import GroupList from "../../components/group/GroupList";
import ScreenLayout from "../../components/ScreenLayout";
import TutorList from "../../components/tutor/TutorList";
import { TUTOR_FRAGMENT_NATIVE } from "../../fragments";

const TUTOR_QUERY = gql`
  query seeTutors($offset: Int!) {
    seeTutors(offset: $offset) {
      ...TutorFragmentNative
    }
  }
  ${TUTOR_FRAGMENT_NATIVE}
`;

const FilterContainer = styled.View`
  padding: 16px;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  margin: 1px 0 1px;
`;

const FilterTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
`;

const FilterSmallContainer = styled.View`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  margin: 1px 0 1px;
`;

const FilterSmallTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
`;

const FilterBtnContainer = styled.View``;

const EmptyContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: center;
  align-items: center;
  height: 168px;
  margin-bottom: 1px;
`;

const EmptyText = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
`;

const CreateGroupBtn = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.greenActColor};
  color: ${(props) => props.theme.textColor};
  font-size: 16px;
  margin-top: 40px;
  border-radius: 8px;
`;

const CreateGroupText = styled.Text`
  color: ${(props) => props.theme.whiteColor};
  font-size: 20px;
  font-weight: 600;
  padding: 16px;
`;

const CreateGroupSmallBtn = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.greenActColor};
  color: ${(props) => props.theme.textColor};
  border-radius: 8px;
`;

const CreateGroupSmallText = styled.Text`
  color: ${(props) => props.theme.whiteColor};
  font-size: 12px;
  font-weight: 600;
  padding: 8px;
`;

export default function Tutor({ navigation }: any) {
  const {
    data: tutorData,
    loading: tutorLoading,
    refetch: tutorRefetch,
    fetchMore: tutorFetchMore,
  } = useQuery(TUTOR_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const renderTutorList = ({ item: tutor }: any) => {
    return <TutorList {...tutor} />;
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await tutorRefetch();
    setRefreshing(false);
  };

  const P0 = { latitude: 37.481492, longitude: 126.884963 };
  const P1 = { latitude: 37.481492, longitude: 126.889963 };
  const [latitude, setLatitude] = useState<string>();
  const [longitude, setLongitude] = useState<string>();

  return (
    <ScreenLayout loading={false}>
      <NaverMapView
        style={{ width: "100%", height: "100%", flex: 0.5 }}
        showsMyLocationButton={true}
        center={{ ...P0, zoom: 14 }}
        onCameraChange={(e) =>
          console.warn("onCameraChange", JSON.stringify(e))
        }
        onMapClick={(e) => console.warn("onMapClick", JSON.stringify(e))}
      >
        <Marker coordinate={P0} onClick={() => console.warn("onClick! p0")} />
        <Marker coordinate={P1} onClick={() => console.warn("onClick! p1")} />
        <Circle
          coordinate={P0}
          color={"rgba(255,0,0,0.3)"}
          radius={500}
          onClick={() => console.warn("onClick! circle")}
        />
      </NaverMapView>
      <FilterSmallContainer>
        <FilterSmallTitle>우리동네 튜터</FilterSmallTitle>
        <FilterBtnContainer>
          <CreateGroupSmallBtn onPress={() => navigation.navigate("AddTutor")}>
            <CreateGroupSmallText>튜터 신청하기</CreateGroupSmallText>
          </CreateGroupSmallBtn>
        </FilterBtnContainer>
      </FilterSmallContainer>
      {tutorData?.seeTutors?.length > 0 ? (
        <FlatList
          style={{
            flex: 1,
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            return tutorFetchMore({
              variables: {
                offset: tutorData?.seeTutors?.length,
              },
            });
          }}
          onRefresh={refresh}
          refreshing={refreshing}
          keyExtractor={(item) => item.id + ""}
          data={tutorData?.seeTutors}
          renderItem={renderTutorList}
        />
      ) : (
        <>
          <EmptyContainer>
            <EmptyText>우리 지역에 아직 튜터가 없네요!</EmptyText>
            <EmptyText>튜터가 되어 사람들을 초대해보세요!</EmptyText>
            <CreateGroupBtn
              onPress={() =>
                navigation.navigate("AddTutor", {
                  sidoName: undefined,
                  gusiName: undefined,
                  dongEubMyunName: undefined,
                  riName: undefined,
                  roadName: undefined,
                  buildingNumber: undefined,
                  address: undefined,
                  addrRoad: undefined,
                  activeArea: undefined,
                  areaLatitude: undefined,
                  areaLongitude: undefined,
                  zipcode: undefined,
                })
              }
            >
              <CreateGroupText>튜터 신청하기</CreateGroupText>
            </CreateGroupBtn>
          </EmptyContainer>
        </>
      )}
    </ScreenLayout>
  );
}
