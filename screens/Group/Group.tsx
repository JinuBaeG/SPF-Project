import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList, useColorScheme } from "react-native";
import Swiper from "react-native-swiper";
import styled from "styled-components/native";
import GroupList from "../../components/group/GroupList";
import Slide from "../../components/group/MyGroup";
import HeaderNav from "../../components/nav/HeaderNav";
import ScreenLayout from "../../components/ScreenLayout";
import { GROUP_FRAGMENT_NATIVE } from "../../fragments";

const MYGROUP_QUERY = gql`
  query seeMyGroup($offset: Int!) {
    seeMyGroup(offset: $offset) {
      ...GroupFragmentNative
    }
  }
  ${GROUP_FRAGMENT_NATIVE}
`;

const GROUP_QUERY = gql`
  query seeGroups($offset: Int!) {
    seeGroups(offset: $offset) {
      ...GroupFragmentNative
    }
  }
  ${GROUP_FRAGMENT_NATIVE}
`;

const MyGroupHeader = styled.View`
  padding: 16px;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const MyGroupTitle = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 20px;
  font-weight: 600;
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

export default function Group({ navigation }: any) {
  const {
    data: myGroupData,
    loading: myGroupLoading,
    refetch: myGroupRefetch,
    fetchMore: myGroyoFetchMore,
  } = useQuery(MYGROUP_QUERY, {
    variables: {
      offset: 0,
    },
  });
  const {
    data: groupData,
    loading: groupLoading,
    refetch: groupRefetch,
    fetchMore: groupFetchMore,
  } = useQuery(GROUP_QUERY, {
    variables: {
      offset: 0,
    },
  });
  const [refreshing, setRefreshing] = useState(false);
  const refresh = async () => {
    setRefreshing(true);
    await groupRefetch();
    setRefreshing(false);
  };

  const renderGroupList = ({ item: group }: any) => {
    return <GroupList {...group} />;
  };
  const MessageButton = () => {
    return <HeaderNav navigation={navigation} />;
  };
  useEffect(() => {
    refresh();
    navigation.setOptions({
      title: "그룹",
      headerRight: MessageButton,
    });
  }, []);

  const isDark = useColorScheme() === "dark";

  return (
    <ScreenLayout loading={groupLoading}>
      <>
        <MyGroupHeader>
          <MyGroupTitle>My그룹</MyGroupTitle>
        </MyGroupHeader>
        {myGroupData?.seeMyGroup?.length > 0 ? (
          <Swiper
            loop
            horizontal
            showsButtons={false}
            showsPagination={false}
            autoplay
            autoplayTimeout={3.5}
            containerStyle={{
              width: "100%",
              height: 168,
              backgroundColor: isDark ? "#1e272e" : "#ffffff",
            }}
          >
            {myGroupData?.seeMyGroup.map((group: any) => (
              <Slide key={group.id} {...group} navigation={navigation} />
            ))}
          </Swiper>
        ) : (
          <EmptyContainer>
            <EmptyText>동호회나 PT그룳에서 함께 즐겨보세요!</EmptyText>
          </EmptyContainer>
        )}
      </>
      {groupData?.seeGroups?.length > 0 ? (
        <FlatList
          onEndReachedThreshold={0.5}
          onEndReached={() =>
            groupFetchMore({
              variables: {
                offset: groupData?.seeGroups?.length,
              },
            })
          }
          onRefresh={refresh}
          refreshing={refreshing}
          ListHeaderComponent={
            <FilterContainer>
              <FilterTitle>우리동네 그룹</FilterTitle>
              <FilterBtnContainer></FilterBtnContainer>
            </FilterContainer>
          }
          keyExtractor={(item) => item.id + ""}
          data={groupData?.seeGroups}
          renderItem={renderGroupList}
        />
      ) : (
        <>
          <FilterContainer>
            <FilterTitle>우리동네 그룹</FilterTitle>
            <FilterBtnContainer></FilterBtnContainer>
          </FilterContainer>
          <EmptyContainer>
            <EmptyText>우리 지역에 아직 그룹이 없네요!</EmptyText>
            <EmptyText>그룹을 만들어 사람들을 초대해보세요!</EmptyText>
            <CreateGroupBtn onPress={() => navigation.navigate("AddGroup")}>
              <CreateGroupText>그룹만들기</CreateGroupText>
            </CreateGroupBtn>
          </EmptyContainer>
        </>
      )}
    </ScreenLayout>
  );
}
