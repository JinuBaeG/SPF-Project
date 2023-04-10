import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import { gql, useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
/**
 * Discription : 그룹 게시판의 공지사항
 *
 */
const SEE_NOTICES_QUERY = gql`
  query seeNotices($id: Int, $sortation: String) {
    seeNotices(id: $id, sortation: $sortation) {
      id
      user {
        id
      }
      title
      discription
      sortation
      createdAt
    }
  }
`;

type NoticeNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Notice"
>;

const BoardContainer = styled.SafeAreaView`
  padding: 16px;
  width: 100%;
  height: 274px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const BoardLine = styled.View`
  width: 100%;
  height: 1px;
  background-color: ${(props) => props.theme.grayInactColor};
`;

const TitleWrap = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const DiscBtn = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Disc = styled.Text`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.theme.grayColor};
`;

const EmptyContainer = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: center;
  align-items: center;
  height: 274px;
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

const ListContainer = styled.View``;

const BoardWrap = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: 4px 8px;
  height: 44px;
  background-color: ${(props) => props.theme.mainBgColor};
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

export default function Notice({ data, sortation }: any) {
  const navigation = useNavigation<NoticeNavigationProps>();
  const {
    data: noticeData,
    loading: noticeLoading,
    refetch: noticeRefetch,
  } = useQuery(SEE_NOTICES_QUERY, {
    variables: {
      id: data.id,
      sortation,
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const [noticeRefreshing, setNoticeRefreshing] = useState(false);
  const noticeRefresh = async () => {
    setNoticeRefreshing(true);
    await noticeRefetch();
    setNoticeRefreshing(false);
  };

  useEffect(() => {
    noticeRefresh();
  }, []);

  return (
    <BoardContainer>
      <TitleWrap>
        <Title>공지사항</Title>
        <DiscBtn
          onPress={() => {
            navigation.navigate("NoticeList", {
              id: noticeData?.seeNotices?.group?.id,
              sortation,
            });
          }}
        >
          <Disc>더보기 </Disc>
          <Ionicons name="caret-forward-circle" size={16} color="#01aa73" />
        </DiscBtn>
      </TitleWrap>
      <BoardLine />
      {noticeData?.seeNotices.length > 0 ? (
        noticeData?.seeNotices.map((item: any) => {
          const getDate = new Date(parseInt(item.createdAt));

          let date = getDate.getDate();
          let month = getDate.getMonth() + 1;
          let year = getDate.getFullYear();
          return (
            <ListContainer key={item.id}>
              <BoardWrap
                onPress={() => {
                  navigation.navigate("NoticeDetail", {
                    id: item.id,
                    user: item.user,
                    title: item.title,
                    discription: item.discription,
                    isLiked: item.isLiked,
                    likes: item.likes,
                    hits: item.hits,
                    boardCommentCount: item.boardCommentCount,
                    boardComments: item.boardComments,
                    createdAt: item.createdAt,
                    sortation: item.sortation,
                  });
                }}
              >
                <BoardPoint>
                  <Ionicons name="caret-forward" size={16} color="#01aa73" />
                </BoardPoint>
                <BoardTitle numberOfLines={1} ellipsizeMode="tail">
                  {item.title}
                </BoardTitle>
                <BoardDate>{year + "-" + month + "-" + date}</BoardDate>
              </BoardWrap>
              <BoardLine />
            </ListContainer>
          );
        })
      ) : (
        <EmptyContainer>
          <EmptyText>공지사항이 없네요!</EmptyText>
          <CreateGroupBtn
            onPress={() => {
              navigation.navigate("AddNotice", { id: data.id, sortation });
            }}
          >
            <CreateGroupText>글 남기기</CreateGroupText>
          </CreateGroupBtn>
        </EmptyContainer>
      )}
    </BoardContainer>
  );
}
