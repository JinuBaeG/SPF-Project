import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

const Container = styled.ScrollView`
  padding: 16px;
  background-color: ${(props) => props.theme.mainBgColor};
`;

export default function ContestAward({ navigation, route }: any) {
  const { width } = useWindowDimensions();
  const source = { html: route.params.contestAwardDetails };

  useEffect(() => {
    navigation.setOptions({
      title: "대회상금안내",
    });
  }, []);
  return (
    <Container>
      <RenderHTML contentWidth={width} source={source} />
    </Container>
  );
}
