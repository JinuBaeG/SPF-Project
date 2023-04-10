import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import { NOTICE_FRAGMENT_NATIVE } from "../../fragments";
import SharedWriteButton from "../../components/shared/SharedWriteButton";
import NoticeComp from "../../components/notice/NoticeComp";

const SEE_NOTICES_QUERY = gql`
  query seeNotices($id: Int, $sortation: String, $offset: Int) {
    seeNotices(id: $id, sortation: $sortation, offset: $offset) {
      ...NoticeFragmentNative
    }
  }
  ${NOTICE_FRAGMENT_NATIVE}
`;

export default function NoticeList({ navigation, route }: any) {
  const id = route.params.id;
  const sortation = route.params.sortation;

  const {
    data,
    loading: noticeLoading,
    refetch: noticeRefetch,
    fetchMore: noticeFetchMore,
  } = useQuery(SEE_NOTICES_QUERY, {
    variables: {
      id,
      sortation,
      offset: 0,
    },
  });

  const renderNoticeList = ({ item: board }: any) => {
    return <NoticeComp {...board} />;
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await noticeRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "공지사항 리스트",
    });
  }, []);

  return (
    <ScreenLayout loading={noticeLoading}>
      <FlatList
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return noticeFetchMore({
            variables: {
              offset: data?.seeNotices?.length,
            },
          });
        }}
        onRefresh={refresh}
        refreshing={refreshing}
        keyExtractor={(item: any) => item.id + ""}
        data={data?.seeNotices}
        renderItem={renderNoticeList}
      />
      <SharedWriteButton />
    </ScreenLayout>
  );
}
