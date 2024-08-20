import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";

import VirtualizedView from "../../components/shared/VirtualizedView";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SportsSearchGroup from "../../components/common/SportsSearchGroup";
import SportsSearchTutor from "../../components/common/SportsSearchTutor";
import SportsSearchFacility from "../../components/common/SportsSearchFacility";
import styled from "styled-components/native";

export default function SportsSelectSearch({ navigation, route }: any) {
  const isFocused = useIsFocused();
  const [sportsEvent, setSportsEvent] = useState<any>(route.params.sportsEvent);

  const SportsFilter = async (sportsName: string) => {
    await AsyncStorage.setItem("filterSports", sportsName);
  };

  useEffect(() => {
    navigation.setOptions({
      title: sportsEvent,
    });
  }, []);

  return (
    <VirtualizedView>
      <SportsSearchGroup navigation={navigation} sportsEvent={sportsEvent} />
      <SportsSearchTutor navigation={navigation} sportsEvent={sportsEvent} />
      <SportsSearchFacility navigation={navigation} sportsEvent={sportsEvent} />
    </VirtualizedView>
  );
}
