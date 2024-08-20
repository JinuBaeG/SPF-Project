import styled from "styled-components/native";
import { GROUP_FRAGMENT_NATIVE } from "../../fragments";
import GroupList from "../group/GroupList";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";

const SEE_GROUP_QUERY = gql`
  query seeSearchGroups($offset: Int!, $sportsEvent: String) {
    seeSearchGroups(offset: $offset, sportsEvent: $sportsEvent) {
      ...GroupFragmentNative
    }
  }
  ${GROUP_FRAGMENT_NATIVE}
`;

const ContainerTitleWrap = styled.View`
  padding: 16px;
`;

const ContainerTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
`;

const Container = styled.ScrollView``;

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

export default function SportsSearchGroup({ navigation, sportsEvent }: any) {
  const { data: groupData, loading: groupLoading } = useQuery(SEE_GROUP_QUERY, {
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
        <ContainerTitle>그룹</ContainerTitle>
      </ContainerTitleWrap>

      {groupData?.seeSearchGroups.length > 0 ? (
        groupData?.seeSearchGroups.map((item: any) => {
          return <GroupList key={item.id} {...item} />;
        })
      ) : (
        <EmptyContainer>
          <EmptyText>아직 그룹이 없네요!</EmptyText>
        </EmptyContainer>
      )}
      {groupData?.seeSearchGroups.length > 0 ? (
        <MoreButton
          onPress={() => {
            SportsFilter(sportsEvent);
            navigation.navigate("그룹");
          }}
        >
          <ButtonText>더보기</ButtonText>
        </MoreButton>
      ) : null}
    </Container>
  );
}
