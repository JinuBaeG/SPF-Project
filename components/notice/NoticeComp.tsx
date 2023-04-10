import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  Image,
  Text,
  useColorScheme,
  TouchableOpacity,
} from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "../../shared.types";
import { gql, useMutation } from "@apollo/client";
import Swiper from "react-native-swiper";

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Notice"
>;

interface toggleLike_toggleLike {
  ok: boolean;
  error: string | undefined;
}

interface toggleLike {
  toggleLike: toggleLike_toggleLike;
}

interface toggleLikeVariables {
  id: number;
}

const NOTICE_TOGGLE_LIKE_MUTATION = gql`
  mutation noticeToggleLike($id: Int!) {
    noticeToggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.View`
  background-color: ${(props) => props.theme.mainBgColor};
  margin-bottom: 8px;
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

export default function NoticeComp({
  id,
  user,
  title,
  discription,
  isLiked,
  likes,
  hits,
  noticeCommentCount,
  noticeComments,
  createdAt,
  sortation,
}: any) {
  const navigation = useNavigation<PhotoCompNavigationProps>();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height / 3);

  const updateToggleLike = (cache: any, result: any) => {
    const {
      data: {
        noticeToggleLike: { ok },
      },
    } = result;
    if (ok) {
      const noticeId = `Notice:${id}`;
      cache.modify({
        id: noticeId,
        fields: {
          isLiked(prev: boolean) {
            return !prev;
          },
          likes(prev: number) {
            if (isLiked) {
              return prev - 1;
            }
            return prev + 1;
          },
        },
      });
    }
  };
  const [toggleLikeMutation] = useMutation<toggleLike, toggleLikeVariables>(
    NOTICE_TOGGLE_LIKE_MUTATION,
    {
      variables: {
        id,
      },
      update: updateToggleLike,
    }
  );
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: user.username,
      id: user.id,
    });
  };
  const isDark = useColorScheme() === "dark";

  const getDate = new Date(parseInt(createdAt));

  let date = getDate.getDate();
  let month = getDate.getMonth() + 1;
  let year = getDate.getFullYear();

  return (
    <Container>
      <Header onPress={goToProfile}>
        <UserAvatar
          resizeMode="cover"
          source={
            user.avatar === null
              ? require(`../../assets/emptyAvatar.png`)
              : { uri: user.avatar }
          }
        />
        <UserInfoWrap>
          <Username>{user.username}</Username>
          <BoardInfo>
            <CreateDate>{year + "." + month + "." + date}</CreateDate>
            <Hits>
              <Ionicons name="eye-outline" />
              {" " + hits}
            </Hits>
          </BoardInfo>
        </UserInfoWrap>
      </Header>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("NoticeDetail", {
            id,
            user,
            title,
            discription,
            isLiked,
            likes,
            hits,
            noticeCommentCount,
            noticeComments,
            createdAt,
            sortation,
          });
        }}
      >
        <Category>
          <CategoryText>
            {title !== null
              ? title.length > 30
                ? "제목 : " + title.substring(0, 29) + "..."
                : "제목 : " + title
              : null}
          </CategoryText>
        </Category>
        <Caption>
          <CaptionText>
            {discription !== null
              ? discription.length > 150
                ? discription.substring(0, 149) + "..."
                : discription
              : null}
          </CaptionText>
        </Caption>
      </TouchableOpacity>

      <NumberContainer>
        <Likes>좋아요 {likes}</Likes>
        <CommentNumber>댓글 {noticeCommentCount}</CommentNumber>
      </NumberContainer>
      <ExtraContainer>
        <Actions>
          <Action
            onPress={() => {
              navigation.navigate("NoticeDetail", {
                id,
                user,
                title,
                discription,
                isLiked,
                likes,
                hits,
                noticeCommentCount,
                noticeComments,
                createdAt,
                sortation,
              });
            }}
          >
            <Ionicons
              name="chatbubble-outline"
              color={isDark ? "#ffffff" : "#1e272e"}
              style={{ marginBottom: 2 }}
              size={16}
            />
            <ActionText>댓글 달기</ActionText>
          </Action>
          <Action onPress={() => toggleLikeMutation()}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked ? "tomato" : isDark ? "#ffffff" : "#1e272e"}
              size={20}
            />
            <ActionText>좋아요</ActionText>
          </Action>
        </Actions>
      </ExtraContainer>
    </Container>
  );
}
