import { useEffect } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";

const MonthContainer = styled.View`
  padding: 16px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const MonthDownBtn = styled.TouchableOpacity``;

const MonthUpBtn = styled.TouchableOpacity``;

const MonthText = styled.Text`
  font-size: 20px;
  font-weight: 600;
`;

export default function ContestMonthSearch({ date, setDate }: any) {
  const downMonth = (date: any) => {
    const downMonth = new Date(date);
    let getYear = downMonth.getFullYear();
    let getMonth = downMonth.getMonth() + 1;

    getMonth = getMonth - 1;

    if (getMonth < 1) {
      getYear = getYear - 1;
      getMonth = 12;
    }

    let viewMonth = getMonth.toString().padStart(2, "00");

    setDate(getYear + "-" + viewMonth);
  };
  const upMonth = (date: any) => {
    const downMonth = new Date(date);
    let getYear = downMonth.getFullYear();
    let getMonth = downMonth.getMonth() + 1;

    getMonth = getMonth + 1;

    if (getMonth > 12) {
      getYear = getYear + 1;
      getMonth = 1;
    }

    let viewMonth = getMonth.toString().padStart(2, "00");

    setDate(getYear + "-" + viewMonth);
  };

  const ViewMonth = (date: any) => {
    const curDate = new Date(date);
    const view = curDate.getMonth() + 1;

    return view;
  };
  useEffect(() => {
    const today = new Date();
    const getDate = today.getDate();
    const getYear = today.getFullYear();
    const getMonth = (today.getMonth() + 1).toString().padStart(2, "00");
    setDate(date || getYear + "-" + getMonth);
  }, [date]);

  return (
    <MonthContainer>
      <MonthDownBtn onPress={() => downMonth(date)}>
        <Ionicons name="chevron-back" size={24} />
      </MonthDownBtn>
      <MonthText>{ViewMonth(date) + "월"}</MonthText>
      <MonthUpBtn onPress={() => upMonth(date)}>
        <Ionicons name="chevron-forward" size={24} />
      </MonthUpBtn>
    </MonthContainer>
  );
}
