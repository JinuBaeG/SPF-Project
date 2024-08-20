import styled from "styled-components/native";
import VirtualizedView from "../../components/shared/VirtualizedView";
import { TUTOR_FRAGMENT_NATIVE } from "../../fragments";
import GroupList from "../../components/group/GroupList";
import { FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import TutorList from "../tutor/TutorList";

const SEE_TUTOR_QUERY = gql`
  query seeSearchTutors($offset: Int!, $sportsEvent: String) {
    seeSearchTutors(offset: $offset, sportsEvent: $sportsEvent) {
      ...TutorFragmentNative
    }
  }
  ${TUTOR_FRAGMENT_NATIVE}
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

export default function SportsSearchTutor({ navigation, sportsEvent }: any) {
  const { data: tutorData, loading: tutorLoading } = useQuery(SEE_TUTOR_QUERY, {
    variables: {
      offset: 0,
      sportsEvent,
    },
    fetchPolicy: "cache-and-network",
  });

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
        <ContainerTitle>튜터</ContainerTitle>
      </ContainerTitleWrap>
      {tutorData?.seeSearchTutors.length > 0 ? (
        tutorData?.seeSearchTutors.map((item: any) => {
          return <TutorList key={item.id} {...item} />;
        })
      ) : (
        <EmptyContainer>
          <EmptyText>아직 튜터가 없네요!</EmptyText>
        </EmptyContainer>
      )}
      {tutorData?.seeSearchTutors.length > 0 ? (
        <MoreButton
          onPress={() => {
            SportsFilter(sportsEvent);
            navigation.navigate("Tutor");
          }}
        >
          <ButtonText>더보기</ButtonText>
        </MoreButton>
      ) : null}
    </Container>
  );
}
