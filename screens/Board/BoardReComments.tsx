import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../shared.types";
import styled from "styled-components/native";
import { FlatList, Platform, TouchableOpacity, UIManager } from "react-native";
import { dateTime } from "../../components/shared/sharedFunction";
import { gql, useMutation, useQuery } from "@apollo/client";
import {
  BOARD_COMMENT_FRAGMENT_NATIVE,
  BOARD_RECOMMENT_FRAGMENT_NATIVE,
} from "../../fragments";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import ScreenLayout from "../../components/ScreenLayout";
import ReCommentComp from "../../components/board/ReCommentComp";
import BoardReComment from "./BoardReComment";
import { useForm } from "react-hook-form";
import EditComment from "../../components/boardComments/EditComment";

interface ICommentCompProps {
  id: number;
  boardComment: {
    id: number;
  };
  user: {
    id: number;
    username: string;
    avatar: string;
  };
  payload: string;
  isMine: boolean;
  createdAt: string;
}

type CommentCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Comments"
>;

const BOARD_COMMENT_QUERY = gql`
  query seeBoardComment($id: Int!) {
    seeBoardComment(id: $id) {
      ...BoardCommentFragmentNative
    }
  }
  ${BOARD_COMMENT_FRAGMENT_NATIVE}
`;

const SEE_BOARD_RECOMMENTS_QUERY = gql`
  query seeBoardReComments($id: Int!, $offset: Int) {
    seeBoardReComments(id: $id, offset: $offset) {
      ...BoardReCommentFragmentNative
    }
  }
  ${BOARD_RECOMMENT_FRAGMENT_NATIVE}
`;

const DELETE_BOARD_COMMENT_MUTATION = gql`
  mutation deleteBoardComment($id: Int!) {
    deleteBoardComment(id: $id) {
      ok
      error
    }
  }
`;

const CommentContainer = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  justify-content: flex-start;
  padding: 8px 0 0;
`;

const CommentText = styled.Text`
  margin-left: 48px;
  color: ${(props) => props.theme.textColor};
`;

const Header = styled.View`
  width: 100%;
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

const UserInfo = styled.View`
  align-items: flex-start;
  justify-content: flex-start;
`;

const Username = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-weight: 600;
`;

const Info = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const UserLocation = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 600;
`;

const UpdateTime = styled.Text`
  color: ${(props) => props.theme.textColor};
  font-size: 12px;
  font-weight: 600;
`;

const Dotted = styled.View`
  width: 2px;
  height: 2px;
  background-color: ${(props) => props.theme.grayColor};
  margin: 0px 4px;
  border-radius: 1px;
`;

const ActionWrapper = styled.View`
  margin: 8px 0 0 48px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const Actions = styled.TouchableOpacity`
  margin-right: 8px;
`;

const CommentEdit = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

const CommentDelete = styled.Text`
  color: ${(props) => props.theme.grayColor};
  font-size: 12px;
  font-weight: 500;
`;

export default function BoardReComments({ navigation, route }: any) {
  // 댓글 내용 가져오기
  const { data: commentData, refetch: commentRefetch } = useQuery(
    BOARD_COMMENT_QUERY,
    {
      variables: {
        id: route.params.id,
      },
    }
  );

  // 답글 리스트 가져오기
  const [refreshing, setRefreshing] = useState(false);
  const {
    data: reCommentData,
    loading: reCommentLoading,
    refetch: reCommentRefetch,
    fetchMore: reCommentFetchMore,
  } = useQuery(SEE_BOARD_RECOMMENTS_QUERY, {
    variables: {
      id: commentData?.seeBoardComment?.id,
      offset: 0,
    },
  });

  const refresh = async () => {
    setRefreshing(true);
    await commentRefetch();
    await reCommentRefetch();
    setRefreshing(false);
  };

  const deleteToggle = (cache: any, result: any) => {
    const {
      data: {
        deleteBoardComment: { ok },
      },
    } = result;

    if (ok) {
      const boardCommentId = `BoardComment:${reCommentData?.seeBoardReComments.id}`;
      const boardId = `Board:${commentData?.seeBoardComment?.id}`;
      // 삭제된 댓글 캐시에서 삭제
      cache.evict({ id: boardCommentId });
      cache.modify({
        id: boardId,
        fields: {
          boardCommentCount(prev: number) {
            return prev - 1;
          },
        },
      });
    }
  };

  const [deleteBoardCommentMutation] = useMutation(
    DELETE_BOARD_COMMENT_MUTATION,
    {
      update: deleteToggle,
    }
  );

  const onDelete = () => {
    deleteBoardCommentMutation({
      variables: {
        id: route.params.id,
      },
    });
  };

  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: route.params.user.username,
      id: route.params.user.id,
    });
  };

  const getDate = new Date(parseInt(commentData?.seeBoardComment?.createdAt));

  const [commentEdit, setCommentEdit] = useState(route.params.editComment);

  const reCommentList = ({ item: reComment }: any) => {
    return <ReCommentComp {...reComment} refresh={refresh} />;
  };

  const ListHeader = () => {
    return (
      <CommentContainer>
        <Header>
          <TouchableOpacity onPress={() => goToProfile()}>
            <UserAvatar
              resizeMode="cover"
              source={
                commentData?.seeBoardComment?.user.avatar === null
                  ? require(`../../assets/emptyAvatar.png`)
                  : { uri: commentData?.seeBoardComment?.user.avatar }
              }
            />
          </TouchableOpacity>
          <UserInfo>
            <TouchableOpacity onPress={() => goToProfile()}>
              <Username>{commentData?.seeBoardComment?.user.username}</Username>
            </TouchableOpacity>
            <Info>
              <UserLocation>임시</UserLocation>
              <Dotted />
              <UpdateTime>{dateTime(getDate)}</UpdateTime>
            </Info>
          </UserInfo>
        </Header>
        {commentEdit !== true ? (
          <CommentText>{commentData?.seeBoardComment?.payload}</CommentText>
        ) : (
          <EditComment
            {...commentData?.seeBoardComment}
            setCommentEdit={setCommentEdit}
            refresh={refresh}
          />
        )}

        <ActionWrapper>
          {commentData?.seeBoardComment?.isMine && commentEdit !== true ? (
            <Actions onPress={() => setCommentEdit(true)}>
              <CommentEdit>수정하기</CommentEdit>
            </Actions>
          ) : null}
          {commentData?.seeBoardComment?.isMine ? (
            <Actions
              onPress={() => {
                onDelete();
              }}
            >
              <CommentDelete>삭제하기</CommentDelete>
            </Actions>
          ) : null}
        </ActionWrapper>
        <BoardReComment
          id={commentData?.seeBoardComment?.id}
          boardReCommentCount={
            commentData?.seeBoardComment?.boardReCommentCount
          }
          refresh={refresh}
        />
      </CommentContainer>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: "답글쓰기",
    });
  }, []);

  return (
    <ScreenLayout loading={reCommentLoading}>
      <KeyboardAwareFlatList
        style={{
          flex: 1,
          width: "100%",
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return reCommentFetchMore({
            variables: {
              id: commentData?.seeBoardComment?.id,
              offset: reCommentData?.seeBoardReComments?.length,
            },
          });
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        data={reCommentData?.seeBoardReComments}
        keyExtractor={(reComment) => "" + reComment.id}
        renderItem={reCommentList}
        ListHeaderComponent={ListHeader}
      />
    </ScreenLayout>
  );
}
