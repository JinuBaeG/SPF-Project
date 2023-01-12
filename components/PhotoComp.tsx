import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "../shared.types";
import { gql, useMutation } from "@apollo/client";

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "Feed"
>;

interface IPhotoCompProps {
  id: number;
  user: {
    id: number;
    avatar: string;
    username: string;
  };
  caption: string;
  file: string;
  isLiked: boolean;
  likes: number;
  commentNumber: number;
}

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

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.View``;
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
const Username = styled.Text`
  color: white;
  font-weight: 600;
`;
const File = styled.Image``;
const Actions = styled.View`
  flex-direction: row;
  align-items: center;
`;
const Action = styled.TouchableOpacity`
  margin-right: 10px;
`;
const Caption = styled.View`
  flex-direction: row;
`;
const CaptionText = styled.Text`
  margin-left: 10px;
  color: white;
`;
const Likes = styled.Text`
  color: white;
  margin: 8px 0;
  font-weight: 600;
`;

const CommentNumber = styled.Text`
  color: white;
  margin: 8px 0;
  font-weight: 600;
`;

const ExtraContainer = styled.View`
  padding: 10px;
`;

export default function PhotoComp({
  id,
  user,
  caption,
  file,
  isLiked,
  likes,
  commentNumber,
}: IPhotoCompProps) {
  const navigation = useNavigation<PhotoCompNavigationProps>();
  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height - 450);
  useEffect(() => {
    Image.getSize(file, (width, height) => {
      setImageHeight(height / 3);
    });
  }, [file]);
  const updateToggleLike = (cache: any, result: any) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${id}`;
      cache.modify({
        id: photoId,
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
    TOGGLE_LIKE_MUTATION,
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
  return (
    <Container>
      <Header onPress={goToProfile}>
        <UserAvatar resizeMode="cover" source={{ uri: user.avatar }} />
        <Username>{user.username}</Username>
      </Header>
      <File
        resizeMode="cover"
        style={{
          width,
          height: imageHeight,
        }}
        source={{ uri: file }}
      />
      <ExtraContainer>
        <Actions>
          <Action onPress={toggleLikeMutation}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              color={isLiked ? "tomato" : "white"}
              size={24}
            />
          </Action>
          <Action onPress={() => navigation.navigate("Comments")}>
            <Ionicons name="chatbubble-outline" color="white" size={24} />
          </Action>
        </Actions>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Likes", {
              photoId: id,
            })
          }
        >
          <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
        </TouchableOpacity>
        <CommentNumber>
          {commentNumber === 1 ? "1 Comment" : `${commentNumber} Comments`}
        </CommentNumber>
        <Caption>
          <TouchableOpacity onPress={goToProfile}>
            <Username>{user.username}</Username>
          </TouchableOpacity>
          <CaptionText>{caption}</CaptionText>
        </Caption>
      </ExtraContainer>
    </Container>
  );
}
