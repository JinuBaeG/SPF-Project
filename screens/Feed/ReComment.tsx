import { gql, useMutation } from "@apollo/client";
import React, { RefObject, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import styled from "styled-components/native";
import useMe from "../../hooks/useMe";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAvoidingView, Platform } from "react-native";
import { cache } from "../../apollo";
import { useIsFocused } from "@react-navigation/native";

const CREATE_RECOMMENT_MUTATION = gql`
  mutation createReComment($commentId: Int!, $payload: String!) {
    createReComment(commentId: $commentId, payload: $payload) {
      ok
      error
      id
    }
  }
`;

const InputContainer = styled.View`
  padding: 16px;
  margin-top: 16px;
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

export default function ReComment({ id, reCommentCount, refresh }: any) {
  // 댓글달기
  const { data: userData } = useMe();
  const { register, handleSubmit, setValue, getValues, watch } = useForm();
  const createReCommentUpdate = (cache: any, result: any) => {
    const { payload } = getValues();
    setValue("payload", "");
    const {
      data: {
        createReComment: { ok, id },
      },
    } = result;

    if (ok && userData?.me) {
      const newReComment = {
        __typename: "ReComment",
        createdAt: Date.now() + "",
        id,
        isMine: true,
        payload,
        user: {
          ...userData.me,
        },
      };
      // 새로 작성한 댓글을 캐시에 저장(작성)
      const newCacheComment = cache.writeFragment({
        data: newReComment,
        fragment: gql`
          fragment newReComment on ReComment {
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
        id: `Comment:${id}`,
        fields: {
          reComments(prev: any) {
            return [...prev, newCacheComment];
          },
          reCommentCount(prev: number) {
            return prev + 1;
          },
        },
      });
      refresh();
    }
  };

  const [createReCommentMutation, { loading: newReCommentloading }] =
    useMutation(CREATE_RECOMMENT_MUTATION, {
      update: createReCommentUpdate,
    });
  const onValid = (data: any) => {
    const { payload } = data;
    if (newReCommentloading) {
      return;
    }
    createReCommentMutation({
      variables: {
        commentId: parseInt(id),
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
          <CountText>답글 </CountText>
          <CountText>{reCommentCount}</CountText>
        </CountWrap>
      </CommentCount>
      <MessageWrap>
        <MessageInput
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
