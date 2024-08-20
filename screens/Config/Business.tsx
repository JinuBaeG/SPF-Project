import { gql, useQuery } from "@apollo/client";
import { useWindowDimensions } from "react-native";
import styled from "styled-components/native";
import ScreenLayout from "../../components/ScreenLayout";
import RenderHTML from "react-native-render-html";
import { useEffect } from "react";

const SEE_BUSINESS_CONFIG_QUERY = gql`
  query seeBusinessInfo {
    seeBusinessInfo {
      businessInfo
    }
  }
`;

const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.whiteColor};
  padding: 0 16px 0 0;
`;

const Caption = styled.View`
  flex-direction: row;
  padding: 16px;
`;

export default function Buisness({ navigation }: any) {
  const { width } = useWindowDimensions();
  const { data: configData, loading: configLoading } = useQuery(
    SEE_BUSINESS_CONFIG_QUERY,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const source = { html: configData?.seeBusinessInfo?.businessInfo };

  useEffect(() => {
    navigation.setOptions({
      title: "사업자 정보 안내",
    });
  }, []);

  return (
    <ScreenLayout loading={configLoading}>
      <Container style={{ width: width }}>
        <Caption>
          <RenderHTML contentWidth={width} source={source} />
        </Caption>
      </Container>
    </ScreenLayout>
  );
}
