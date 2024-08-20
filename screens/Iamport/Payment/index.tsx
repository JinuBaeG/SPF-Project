import React, { useEffect } from "react";
import IMP from "iamport-react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { RootStackParamList } from "../NavigationService";
import { getUserCode } from "../utils";
import Loading from "../Loading";
import { SafeAreaView } from "react-native-safe-area-context";

function Payment({ route, navigation }: any) {
  const params = route.params?.params;
  const tierCode = route.params?.tierCode;
  const userCode = process.env.IAMPORT_CODE + "";

  useEffect(() => {
    navigation.setOptions({
      title: "결제하기",
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      <IMP.Payment
        userCode={userCode}
        tierCode={tierCode}
        loading={<Loading />}
        data={params!}
        callback={(response) => navigation.replace("PaymentResult", response)}
      />
    </SafeAreaView>
  );
}

export default Payment;
