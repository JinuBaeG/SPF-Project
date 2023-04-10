import { gql, useQuery } from "@apollo/client";
import React from "react";
import { FlatList, Text, View } from "react-native";
import styled from "styled-components/native";

const CATEGORY_QUERY = gql`
  query seeCategory($offset: Int) {
    seeCategory(offset: $offset) {
      id
      name
    }
  }
`;

const CategoryContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
  width: 100%;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const CategoryView = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  margin-right: 4px;
  padding: 4px;
  background-color: ${(props) => props.theme.greenActColor};
  border-radius: 4px;
  height: 28px;
`;

const CategoryText = styled.Text`
  color: ${(props) => props.theme.greenTextColor};
`;

export default function Category() {
  const { data, loading } = useQuery(CATEGORY_QUERY, {
    variables: {
      offset: 0,
    },
  });

  const renderCategory = ({ item: category }: any) => {
    return (
      <CategoryView>
        <CategoryText>{category.name}</CategoryText>
      </CategoryView>
    );
  };
  return (
    <CategoryContainer>
      <CategoryView>
        <CategoryText>전체보기</CategoryText>
      </CategoryView>
      <FlatList
        horizontal={true}
        data={data?.seeCategory}
        keyExtractor={(category: any) => "" + category.id}
        renderItem={renderCategory}
      />
    </CategoryContainer>
  );
}
