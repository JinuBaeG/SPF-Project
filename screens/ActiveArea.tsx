import React, { useEffect, useState } from "react";

export default function ActiveArea({ navigation }: any) {
  useEffect(() => {
    navigation.setOptions({
      title: "활동 지역 설정",
    });
  }, []);

  const P0 = { latitude: 37.564362, longitude: 126.977011 };
  const P1 = { latitude: 37.565051, longitude: 126.978567 };
  const P2 = { latitude: 37.565383, longitude: 126.976292 };
  const [latitude, setLatitude] = useState<string>();
  const [longitude, setLongitude] = useState<string>();

  return (<></>
  );
}
