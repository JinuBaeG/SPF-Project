import { gql, useMutation, useQuery } from "@apollo/client";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useState } from "react";
import {
  PHOTO_FRAGMENT_NATIVE,
  COMMENT_FRAGMENT_NATIVE,
} from "../../fragments";
import {
  useWindowDimensions,
  Image,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import styled from "styled-components/native";
import { RootStackParamList } from "../../shared.types";
import { Ionicons } from "@expo/vector-icons";
import Swiper from "react-native-swiper";
import CommentComp from "../../components/feed/CommentComp";
import Comments from "./Comments";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import ScreenLayout from "../../components/ScreenLayout";

type PhotoCompNavigationProps = NativeStackNavigationProp<
  RootStackParamList,
  "PhotoDetail"
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

const FEED_DETAIL_QUERY = gql`
  query seePhoto($id: Int) {
    seePhoto(id: $id) {
      ...PhotoFragmentNative
      user {
        id
        username
        avatar
      }
      caption
      comments {
        ...CommentFragmentNative
      }
      createdAt
      isMine
    }
  }
  ${PHOTO_FRAGMENT_NATIVE}
  ${COMMENT_FRAGMENT_NATIVE}
`;

const PHOTO_COMMENTS_QUERY = gql`
  query seePhotoComments($id: Int!) {
    seePhotoComments(id: $id) {
      id
      photo {
        id
      }
      user {
        id
        username
        avatar
      }
      reCommentCount
      payload
      isMine
      createdAt
    }
  }
`;

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const Container = styled.ScrollView`
  flex: 1;
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
  color: ${(props) => props.theme.greenActColor};
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

export default function PhotoDetail({ navigation, route }: any) {
  const {
    data: feedData,
    loading: feedLoading,
    refetch: feedRefetch,
  } = useQuery(FEED_DETAIL_QUERY, {
    variables: {
      id: route.params.id,
    },
    fetchPolicy: "cache-and-network",
  });

  const { width, height } = useWindowDimensions();
  const [imageHeight, setImageHeight] = useState(height / 3);

  const updateToggleLike = (cache: any, result: any) => {
    const {
      data: {
        toggleLike: { ok },
      },
    } = result;
    if (ok) {
      const photoId = `Photo:${feedData?.seePhoto?.id}`;
      cache.modify({
        id: photoId,
        fields: {
          isLiked(prev: boolean) {
            return !prev;
          },
          likes(prev: number) {
            if (data?.seePhoto?.isLiked) {
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
        id: feedData?.seePhoto?.id,
      },
      update: updateToggleLike,
    }
  );
  const goToProfile = () => {
    navigation.navigate("Profile", {
      username: feedData?.seePhoto?.user.username,
      id: feedData?.seePhoto?.user.id,
    });
  };

  // 댓글 목록 가져오기
  const [refreshing, setRefreshing] = useState(false);

  const {
    data,
    loading: listLoading,
    refetch,
    fetchMore: commentsFetchMore,
  } = useQuery(PHOTO_COMMENTS_QUERY, {
    variables: {
      id: route.params.id,
      offset: 0,
    },
  });

  const refresh = async () => {
    setRefreshing(true);
    await feedRefetch();
    await refetch();
    setRefreshing(false);
  };

  const commentList = ({ item: comment }: any) => {
    return <CommentComp {...comment} />;
  };

  const ListHeader = () => {
    const getDate = new Date(parseInt(feedData?.seePhoto?.createdAt));

    let date = getDate.getDate();
    let month = getDate.getMonth() + 1;
    let year = getDate.getFullYear();

    return (
      <Container>
        <Header onPress={goToProfile}>
          <UserAvatar
            resizeMode="cover"
            source={
              feedData?.seePhoto?.user.avatar === null
                ? require(`../../assets/emptyAvatar.png`)
                : { uri: feedData?.seePhoto?.user.avatar }
            }
          />
          <UserInfoWrap>
            <Username>{feedData?.seePhoto?.user.username}</Username>
            <BoardInfo>
              <CreateDate>{year + "." + month + "." + date}</CreateDate>
            </BoardInfo>
          </UserInfoWrap>
        </Header>
        {feedData?.seePhoto?.feedCategoryList !== null ? (
          <Category>
            <CategoryText>
              {feedData?.seePhoto?.feedCategoryList[0].name}
            </CategoryText>
          </Category>
        ) : null}
        <Caption>
          <CaptionText>{feedData?.seePhoto?.caption}</CaptionText>
        </Caption>
        {feedData?.seePhoto?.feedUpload.length > 0 ? (
          <>
            <Swiper
              loop
              horizontal
              showsButtons={false}
              showsPagination={true}
              autoplay={false}
              autoplayTimeout={3.5}
              containerStyle={{
                paddingBottom: 20,
                marginBottom: 30,
                width: "100%",
                height: height / 3,
              }}
              paginationStyle={{
                position: "absolute",
                bottom: 0,
              }}
            >
              {feedData?.seePhoto?.feedUpload.map((file: any, index: any) => (
                <File
                  resizeMode="cover"
                  style={{
                    width,
                    height: imageHeight,
                  }}
                  source={{ uri: file.imagePath }}
                  key={file.id}
                />
              ))}
            </Swiper>
          </>
        ) : null}
        <ExtraContainer>
          <Actions>
            <Action onPress={() => toggleLikeMutation()}>
              <Ionicons
                name={feedData?.seePhoto?.isLiked ? "heart" : "heart-outline"}
                color={
                  feedData?.seePhoto?.isLiked
                    ? "tomato"
                    : "rgba(136, 136, 136, 0.4)"
                }
                size={20}
              />
              <ActionText>좋아요</ActionText>
            </Action>
          </Actions>
        </ExtraContainer>
        <Comments
          id={feedData?.seePhoto?.id}
          commentCount={feedData?.seePhoto?.commentCount}
          refresh={refresh}
        />
      </Container>
    );
  };

  useEffect(() => {
    navigation.setOptions({
      title: "동네소식",
    });
  }, []);

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
              id: feedData?.seePhoto?.id,
              offset: data?.seePhotoComments?.length,
            },
          });
        }}
        refreshing={refreshing}
        onRefresh={refresh}
        data={data?.seePhotoComments}
        keyExtractor={(comment) => "" + comment.id}
        renderItem={commentList}
        ListHeaderComponent={() => ListHeader()}
      />
    </ScreenLayout>
  );
}
