import { gql, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import styled from "styled-components/native";
import { cache } from "../../apollo";
import ScreenLayout from "../../components/ScreenLayout";
import InquiryList from "../../components/shared/InquiryList";
import { TUTOR_INQUIRY_FRAGMENT_NATIVE } from "../../fragments";

const SEE_INQUIRIES_QUERY = gql`
  query seeInquiries($id: Int, $offset: Int) {
    seeInquiries(id: $id, offset: $offset) {
      ...TutorInquiryFragmentNative
    }
  }
  ${TUTOR_INQUIRY_FRAGMENT_NATIVE}
`;

export default function TutorInquiry({ navigation, route }: any) {
  const id = route.params.id;

  const {
    data,
    loading: inquiryLoading,
    refetch: inquiryRefetch,
    fetchMore: inquiryFetchMore,
  } = useQuery(SEE_INQUIRIES_QUERY, {
    variables: {
      id,
      offset: 0,
    },
  });

  const renderInquiryList = ({ item: inquiry }: any) => {
    return <InquiryList {...inquiry} />;
  };

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await inquiryRefetch();
    setRefreshing(false);
  };

  useEffect(() => {
    navigation.setOptions({
      title: "문의보기",
    });
  }, []);

  return (
    <ScreenLayout loading={inquiryLoading}>
      <FlatList
        style={{
          flex: 1,
        }}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          return inquiryFetchMore({
            variables: {
              offset: data?.seeInquiries?.length,
            },
          });
        }}
        onRefresh={refresh}
        refreshing={refreshing}
        keyExtractor={(item: any) => item.id + ""}
        data={data?.seeInquiries}
        renderItem={renderInquiryList}
      />
    </ScreenLayout>
  );
}
