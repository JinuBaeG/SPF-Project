import React, { useState } from "react";
import styled from "styled-components/native";
import { Entypo } from "@expo/vector-icons";
import RenderHTML from "react-native-render-html";
import { useWindowDimensions } from "react-native";

const ContestNoticeContainer = styled.TouchableOpacity`
  padding: 16px;
`;

const ContestNoticeTitle = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
`;

const ContestNoticeTitleText = styled.Text`
  width: 75%;
`;

const ContestNoticeDisc = styled.View`
  padding: 16px;
  background-color: ${(props) => props.theme.grayInactColor};
`;

export default function ContestNoticeToggle(contestNotice: any) {
  const { width } = useWindowDimensions();
  const source = { html: contestNotice.noticeDiscription };
  const [active, setActive] = useState(false);

  return (
    <ContestNoticeContainer onPress={() => setActive(!active)}>
      <ContestNoticeTitle
        style={{
          borderBottomColor: "rgba(136, 136, 136, 0.4)",
          borderBottomWidth: 1,
        }}
      >
        <ContestNoticeTitleText>
          {contestNotice.noticeTitle}
        </ContestNoticeTitleText>
        {active ? (
          <Entypo name="chevron-thin-up" size={20} color={"gray"} />
        ) : (
          <Entypo name="chevron-thin-down" size={20} color={"gray"} />
        )}
      </ContestNoticeTitle>
      {active ? (
        <ContestNoticeDisc>
          <RenderHTML contentWidth={width} source={source} />
        </ContestNoticeDisc>
      ) : null}
    </ContestNoticeContainer>
  );
}
