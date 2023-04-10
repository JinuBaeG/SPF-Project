import { gql, useMutation, useQuery } from "@apollo/client";
import React, { RefObject, useEffect, useRef, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import ScreenLayout from "../../components/ScreenLayout";
import CommentComp from "../../components/notice/CommentComp";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import {
  NOTICE_COMMENT_FRAGMENT_NATIVE,
  NOTICE_FRAGMENT_NATIVE,
} from "../../fragments";
import NoticeComments from "./NoticeComments";

const SEE_NOTICE_QUERY = gql`
  query seeNotice($id: Int) {
    seeNotice(id: $id) {
      ...NoticeFragmentNative
    }
  }
  ${NOTICE_FRAGMENT_NATIVE}
`;

const NOTICE_COMMENTS_QUERY = gql`
  query seeNoticeComments($id: Int!, $offset: Int) {
    seeNoticeComments(id: $id, offset: $offset) {
      ...NoticeCommentFragmentNative
    }
  }
  ${NOTICE_COMMENT_FRAGMENT_NATIVE}
`;

const NOTICE_TOGGLE_LIKE_MUTATION = gql`
  mutation noticeToggleLike($id: Int!) {
    noticeToggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.SafeAreaView`
  background-color: ${(props) => props.theme.mainBgColor};
  width: 100%;
`;

const Header = styled.TouchableOpacity`
  padding: 12px;
  flex-direction: row;
  align-items: center;
`;

const UserAvatar = styled.Image`
  margin-right: 10px;
  width: 28px;
  height: 28px;
  border-radius: 50px;
`;

const UserInfoWrap = styled.View``;

const Username = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;

const BoardInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const CreateDate = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
  margin-right: 8px;
`;

const Hits = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.textColor};
`;

const File = styled.Image``;

const Actions = styled.View`
  flex-direction: row;
  align-items: center;
  margin-right: 4px;
`;

const Action = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 12px;
`;

const ActionText = styled.Text`
  font-size: 16px;
  color: ${(props) => props.theme.grayInactColor};
  margin-left: 4px;
`;

const Caption = styled.View`
  flex-direction: row;
  padding: 4px 16px 16px;
`;

const CaptionText = styled.Text`
  margin-left: 10px;
  color: ${(props) => props.theme.textColor};
`;

const Category = styled.View`
  flex-direction: row;
  padding: 16px 16px 4px;
`;

const CategoryText = styled.Text`
  margin-left: 10px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};
`;

const Likes = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  margin: 8px 4px;
  font-weight: 600;
`;

const CommentNumber = styled.Text`
  color: ${(props) => props.theme.grayInactColor};
  margin: 8px 4px;
  font-weight: 600;
`;

const ExtraContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
`;

const NumberContainer = styled.View`
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: 0 16px;
`;

export default function NoticeDetail({ navigation, route }: any) {
  // 게시글 정보 가져오기
  const {
    data: noticeData,
    loading: noticeLoading,
    refetch: noticeRefetch,
  } = useQuery(SEE_NOTICE_QUERY, {
    variables: { id: route.params.id },
    fetchPolicy: "cache-and-network",
  });

  // 좋아요 버튼 액션
  const updateToggleLike = (cache: any, result: any) => {
    const {
      data: {
        noticeToggleLike: { ok },
      },
    } = result;
    if (ok) {
      const noticeId = `Board:${noticeData?.seeNotice?.id}`;
      cache.modify({
        id: noticeId,
        fields: {
          isLiked(prev: boolean) {
            return !prev;
          },
          likes(prev: number) {
            if (noticeData?.seeNotice?.isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };

  const [toggleLikeMutation] = useMutation(NOTICE_TOGGLE_LIKE_MUTATION, {
    variables: {
      id: noticeData?.seeNotice?.id,
      sortation: noticeData?.seeNotice?.sortation,
    },
    update: updateToggleLike,
  });

  // 작성자 프로필로 이동
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: noticeData?.seeNotice?.user.username,
      id: noticeData?.seeNotice?.user.id,
    });
  };

  // 댓글 목록 가져오기
  const [refreshing, setRefreshing] = useState(false);
  const {
    data,
    loading: listLoading,
    refetch,
    fetchMore: commentsFetchMore,
  } = useQuery(NOTICE_COMMENTS_QUERY, {
    variables: {
      id: noticeData?.seeNotice?.id,
      offset: 0,
    },
    fetchPolicy: "cache-and-network",
  });

  const refresh = async () => {
    setRefreshing(true);
    await noticeRefetch();
    await refetch();
    setRefreshing(false);
  };
  const commentList = ({ item: comment }: any) => {
    return <CommentComp {...comment} />;
  };

  const ListHeader = () => {
    const getDate = new Date(parseInt(noticeData?.seeNotice?.createdAt));

    let date = getDate.getDate();
    let month = getDate.getMonth() + 1;
    let year = getDate.getFullYear();

    return (
      <Container>
        <Header onPress={goToProfile}>
          <UserAvatar
            resizeMode="cover"
            source={
              noticeData?.seeNotice?.user.avatar === null
                ? require(`../../assets/emptyAvatar.png`)
                : { uri: noticeData?.seeNotice?.user.avatar }
            }
          />
          <UserInfoWrap>
            <Username>{noticeData?.seeNotice?.user.username}</Username>
            <BoardInfo>
              <CreateDate>{year + "." + month + "." + date}</CreateDate>
              <Hits>
                <Ionicons name="eye-outline" />
                {" " + noticeData?.seeNotice?.hits}
              </Hits>
            </BoardInfo>
          </UserInfoWrap>
        </Header>
        <Category>
          <CategoryText>{noticeData?.seeNotice?.title}</CategoryText>
        </Category>
        <Caption>
          <CaptionText>{noticeData?.seeNotice?.discription}</CaptionText>
        </Caption>
        <ExtraContainer>
          <Actions>
            <Action onPress={() => toggleLikeMutation()}>
              <Ionicons
                name={
                  noticeData?.seeNotice?.isLiked ? "heart" : "heart-outline"
                }
                color={
                  noticeData?.seeNotice?.isLiked
                    ? "tomato"
                    : "rgba(136, 136, 136, 0.4)"
                }
                size={20}
              />
              <ActionText>좋아요 {noticeData?.seeNotice?.likes}</ActionText>
            </Action>
          </Actions>
        </ExtraContainer>
        <NoticeComments
          id={noticeData?.seeNotice?.id}
          noticeCommentCount={noticeData?.seeNotice?.noticeCommentCount}
          refresh={refresh}
        />
      </Container>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title:
        route.params.title !== null
          ? route.params.title > 10
            ? route.params.title.substring(0, 9) + "..."
            : route.params.title
          : "제목없음",
    });
  });

  return (
    <ScreenLayout loading={listLoading}>
      <KeyboardAwareFlatList
        style={{
          flex: 1,
          width: "100%",
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return commentsFetchMore({
            variables: {
              id: noticeData?.seeNotice?.id,
              offset: data?.seeNoticeComments?.length,
            },
          });
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        data={data?.seeNoticeComments}
        keyExtractor={(comment) => "" + comment.id}
        renderItem={commentList}
        ListHeaderComponent={ListHeader}
      />
    </ScreenLayout>
  );
}
