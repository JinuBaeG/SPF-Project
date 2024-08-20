import { Alert, Linking } from "react-native";
import VersionCheck from "react-native-version-check";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Font from "expo-font";
import { Asset } from "expo-asset";
import { NavigationContainer } from "@react-navigation/native";
import LoggedOutNav from "./navigators/LoggedOutNav";
import { ApolloProvider, useReactiveVar } from "@apollo/client";
import client, { cache, isLoggedInVar, logUserOut, tokenVar } from "./apollo";
import LoggedInNav from "./navigators/LoggedInNav";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StatusBarStyle,
  useColorScheme,
} from "react-native";
import { AsyncStorageWrapper, CachePersistor } from "apollo3-cache-persist";
import { ThemeProvider } from "styled-components/native";
import { darkTheme, lightTheme } from "./styles";
import * as Location from "expo-location";
import { NativeBaseProvider } from "native-base";
import { SafeAreaProvider } from "react-native-safe-area-context";

interface ILocation {
  latitude: number;
  longitude: number;
}

const STYLES = ["default", "dark-content", "light-content"] as const;
const TRANSITIONS = ["fade", "slide", "none"] as const;

export default function App() {
  /*
  VersionCheck.needUpdate().then(async (res) => {
    if (res.isNeeded) {
      Alert.alert(
        "새로운 버젼이 업데이트 되었습니다.",
        "스토어로 이동합니다.",
        [
          {
            text: "업데이트",
            onPress: () => {
              Linking.openURL(res.storeUrl); // open store if update is needed.
            },
          },
        ]
      );
    }
  });
  */
  const [loading, setLoading] = useState(true);
  const onFinish = () => setLoading(false);
  const isLoggedIn = useReactiveVar(isLoggedInVar);
  cache.evict({ id: "ROOT_QUERY" });
  cache.gc();
  const [location, setLocation] = useState<ILocation | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | undefined>();
  const [ready, setReady] = useState(false);
  /*
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied ");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      await AsyncStorage.setItem(
        "latitude",
        location.coords.latitude.toString()
      );
      await AsyncStorage.setItem(
        "longitude",
        location.coords.longitude.toString()
      );
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setReady(true);
    })();
  }, []);
*/
  const preloadAssets = async () => {
    const fontsToLoad = [Ionicons.font];
    const fontPromises = fontsToLoad.map((font: any) => Font.loadAsync(font));
    const imagesToLoad = [require("./assets/emptyAvatar.png")];

    const imagePromises = imagesToLoad.map((image: any) =>
      Asset.loadAsync(image)
    );
    await Promise.all([...fontPromises, ...imagePromises]);
  };
  const preload = async () => {
    const token = await AsyncStorage.getItem("token");

    if (token) {
      isLoggedInVar(true);
      tokenVar(token);
    }
    const persistor = new CachePersistor({
      cache,
      storage: new AsyncStorageWrapper(AsyncStorage),
    });
    await persistor.restore();
    preloadAssets();
  };

  const isDark = useColorScheme() === "dark";

  useEffect(() => {
    preload();
  }, []);

  return (
    <NativeBaseProvider>
      <SafeAreaProvider>
        <ApolloProvider client={client}>
          <ThemeProvider theme={lightTheme}>
            <NavigationContainer>
              <StatusBar
                animated={true}
                backgroundColor="#01aa73"
                barStyle={isDark ? "dark-content" : "default"}
                showHideTransition={"fade"}
                hidden={false}
              />
              <LoggedInNav />
            </NavigationContainer>
          </ThemeProvider>
        </ApolloProvider>
      </SafeAreaProvider>
    </NativeBaseProvider>
  );
}
