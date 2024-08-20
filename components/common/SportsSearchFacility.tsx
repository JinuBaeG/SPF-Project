import styled from "styled-components/native";
import VirtualizedView from "../shared/VirtualizedView";
import { FACILITY_FRAGMENT_NATIVE } from "../../fragments";
import { FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import TutorList from "../tutor/TutorList";
import FacilityList from "../facility/FacilityList";

const SEE_FACILTIES_QUERY = gql`
  query seeSearchFacilities($offset: Int!, $sportsEvent: String) {
    seeSearchFacilities(offset: $offset, sportsEvent: $sportsEvent) {
      ...FacilityFragmentNative
    }
  }
  ${FACILITY_FRAGMENT_NATIVE}
`;

const ContainerTitleWrap = styled.View`
  padding: 16px;
`;

const ContainerTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
`;

const Container = styled.ScrollView`
  flex: 1.5;
`;

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

const MoreButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.mainBgColor};
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ButtonText = styled.Text`
  padding: 8px 16px;
  margin: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  color: ${(props) => props.theme.textColor};
`;

export default function SportsSearchFacility({ navigation, sportsEvent }: any) {
  const { data: facilityData, loading: facilityLoading } = useQuery(
    SEE_FACILTIES_QUERY,
    {
      variables: {
        offset: 0,
        sportsEvent,
      },
      fetchPolicy: "cache-and-network",
    }
  );

  const renderFacilityList = ({ item: facility }: any) => {
    return <FacilityList {...facility} />;
  };

  const SportsFilter = async (sportsName: string) => {
    await AsyncStorage.setItem("filterSports", sportsName);
  };

  useEffect(() => {
    navigation.setOptions({
      title: sportsEvent,
    });
  }, []);

  return (
    <Container>
      <ContainerTitleWrap>
        <ContainerTitle>시설</ContainerTitle>
      </ContainerTitleWrap>
      {facilityData?.seeSearchFacilities.length > 0 ? (
        facilityData?.seeSearchFacilities.map((item: any) => {
          return <FacilityList key={item.id} {...item} />;
        })
      ) : (
        <EmptyContainer>
          <EmptyText>아직 시설이 없네요!</EmptyText>
        </EmptyContainer>
      )}
      {facilityData?.seeSearchFacilities.length > 0 ? (
        <MoreButton
          onPress={() => {
            SportsFilter(sportsEvent);
            navigation.navigate("Facility");
          }}
        >
          <ButtonText>더보기</ButtonText>
        </MoreButton>
      ) : null}
    </Container>
  );
}
