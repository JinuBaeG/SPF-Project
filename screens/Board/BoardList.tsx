import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { Ionicons } from "@expo/vector-icons";
import { BOARD_FRAGMENT_NATIVE } from "../../fragments";
import BoardComp from "../../components/board/BoardComp";
import SharedWriteButton from "../../components/shared/SharedWriteButton";

const SEE_BOARDS_QUERY = gql`
  query seeBoards($id: Int, $sortation: String, $offset: Int) {
    seeBoards(id: $id, sortation: $sortation, offset: $offset) {
      ...BoardFragmentNative
    }
  }
  ${BOARD_FRAGMENT_NATIVE}
`;

const ListContainer = styled.View``;

const BoardWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  height: 44px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const BoardLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.grayInactColor};
`;

const BoardPoint = styled.View`
  padding: 0 4px;
`;

const BoardTitle = styled.Text`
  width: 282px;
  padding: 0 4px;
  font-size: 12px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const BoardDate = styled.Text`
  padding: 0 4px;
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.textColor};
`;

export default function BoardList({ navigation, route }: any) {
  const id = route.params.id;
  const sortation = route.params.sortation;

  const {
    data,
    loading: boardLoading,
    refetch: boardRefetch,
    fetchMore: boardFetchMore,
  } = useQuery(SEE_BOARDS_QUERY, {
    variables: {
      id,
      sortation,
      offset: 0,
    },
  });

  const renderBoardList = ({ item: board }: any) => {
    return <BoardComp {...board} />;
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await boardRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "게시판 리스트",
    });
  }, []);

  return (
    <ScreenLayout loading={boardLoading}>
      <FlatList
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return boardFetchMore({
            variables: {
              offset: data?.seeBoards?.length,
            },
          });
        }}
        onRefresh={refresh}
        refreshing={refreshing}
        keyExtractor={(item: any) => item.id + ""}
        data={data?.seeBoards}
        renderItem={renderBoardList}
      />
      <SharedWriteButton />
    </ScreenLayout>
  );
}
