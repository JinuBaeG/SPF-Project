import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import PhotoComp from "../components/PhotoComp";
import ScreenLayout from "../components/ScreenLayout";
import { COMMENT_FRAGMENT_NATIVE, PHOTO_FRAGMENT_NATIVE } from "../fragments";
import { Ionicons } from "@expo/vector-icons";

const FEED_QUERY = gql`
  query seeFeed($offset: Int!) {
    seeFeed(offset: $offset) {
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

export default function Feed({ navigation }: any) {
  const { data, loading, refetch, fetchMore } = useQuery(FEED_QUERY, {
    variables: {
      offset: 0,
    },
  });
  const renderPhoto = ({ item: photo }: any) => {
    return <PhotoComp {...photo} />;
  };
  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };
  const [refreshing, setRefreshing] = useState(false);
  const MessageButton = () => {
    return (
      <TouchableOpacity
        style={{ marginRight: 16 }}
        onPress={() => navigation.navigate("Messages")}
      >
        <Ionicons name="paper-plane" color="white" size={24} />
      </TouchableOpacity>
    );
  };
  useEffect(() => {
    navigation.setOptions({
      headerRight: MessageButton,
    });
  }, []);
  return (
    <ScreenLayout loading={loading}>
      <FlatList
        onEndReachedThreshold={0.5}
        onEndReached={() =>
          fetchMore({
            variables: {
              offset: data?.seeFeed?.length,
            },
          })
        }
        refreshing={refreshing}
        onRefresh={refresh}
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
        data={data?.seeFeed}
        keyExtractor={(photo) => "" + photo.id}
        renderItem={renderPhoto}
      />
    </ScreenLayout>
  );
}
