import { gql, useMutation } from "@apollo/client";
import React, { RefObject, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import useMe from "../../hooks/useMe";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform } from "react-native";
import { cache } from "../../apollo";
import { useIsFocused } from "@react-navigation/native";

const CREATE_NOTICE_COMMENT_MUTATION = gql`
  mutation createNoticeComment($noticeId: Int!, $payload: String!) {
    createNoticeComment(noticeId: $noticeId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const InputContainer = styled.View`
  padding: 16px;
  background-color: ${(props) => props.theme.greenActColor};
`;

const CommentCount = styled.View``;

const CountWrap = styled.View`
  margin-bottom: 8px;
  flex-direction: row;
  align-items: center;
`;

const CountText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => props.theme.whiteColor};
`;

const MessageWrap = styled.View`
  flex-direction: row;
  align-items: center;
`;

const MessageInput = styled.TextInput`
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
  padding: 8px 12px;
  color: ${(props) => props.theme.textColor};
  border-radius: 4px;
  border: 2px solid ${(props) => props.theme.grayColor};
  margin-right: 8px;
`;

const SendButton = styled.TouchableOpacity``;

export default function NoticeComments({
  id,
  noticeCommentCount,
  refresh,
}: any) {
  const noticeCommentsRef: React.MutableRefObject<null> = useRef(null);

  const onFocusNext = (nextRef: RefObject<HTMLInputElement>): void => {
    nextRef?.current?.focus();
  };

  // 댓글달기
  const { data: userData } = useMe();
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const createNoticeCommentUpdate = (cache: any, result: any) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createNoticeComment: { ok, id },
      },
    } = result;

    if (ok && userData?.me) {
      const newNoticeComment = {
        __typename: "NoticeComment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      // 새로 작성한 댓글을 캐시에 저장(작성)
      const newCacheNoticeComment = cache.writeFragment({
        data: newNoticeComment,
        fragment: gql`
          fragment newNoticeComment on NoticeComment {
            id
            createdAt
            isMine
            payload
            user {
              username
              avatar
            }
          }
        `,
      });
      // 게시글에 새로 작성되어 캐시에 저장된 댓글을 업데이트
      cache.modify({
        id: `Notice:${id}`,
        fields: {
          boardComments(prev: any) {
            return [...prev, newCacheNoticeComment];
          },
          boardCommentCount(prev: number) {
            return prev + 1;
          },
        },
      });
      refresh();
      onFocusNext(noticeCommentsRef);
    }
  };

  const [createNoticeCommentMutation, { loading: newCommentloading }] =
    useMutation(CREATE_NOTICE_COMMENT_MUTATION, {
      update: createNoticeCommentUpdate,
    });
  const onValid = (data: any) => {
    const { payload } = data;
    if (newCommentloading) {
      return;
    }
    createNoticeCommentMutation({
      variables: {
        noticeId: parseInt(id),
        payload,
      },
    });
  };

  useEffect(() => {
    register("payload", {
      required: true,
      minLength: 3,
    });
  }, []);

  return (
    <InputContainer>
      <CommentCount>
        <CountWrap>
          <Ionicons
            name="chatbubble"
            color={"#ffffff"}
            style={{ marginRight: 2 }}
            size={24}
          />
          <CountText>댓글 </CountText>
          <CountText>{noticeCommentCount}</CountText>
        </CountWrap>
      </CommentCount>
      <MessageWrap>
        <MessageInput
          ref={noticeCommentsRef}
          placeholderTextColor="rgba(0,0,0,0.5)"
          placeholder="내용을 입력해주세요."
          returnKeyLabel="Done"
          returnKeyType="done"
          multiline={true}
          onSubmitEditing={handleSubmit(onValid)}
          onChangeText={(text) => setValue("payload", text)}
          value={watch("payload")}
          style={{ width: 320, height: 80 }}
        />
        <SendButton
          onPress={handleSubmit(onValid)}
          disabled={!Boolean(watch("payload"))}
        >
          <Ionicons
            name="send"
            color={
              !Boolean(watch("payload")) ? "rgba(255, 255, 255, 1)" : "white"
            }
            size={20}
          />
        </SendButton>
      </MessageWrap>
    </InputContainer>
  );
}
