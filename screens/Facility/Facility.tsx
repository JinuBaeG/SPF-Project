import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import NaverMapView, {
  Circle,
  Marker,
  Path,
  Polyline,
  Polygon,
} from "react-native-nmap";

export default function Facility({ navigation }: any) {
  const P0 = { latitude: 37.481492, longitude: 126.884963 };
  const P1 = { latitude: 37.481492, longitude: 126.889963 };
  const [latitude, setLatitude] = useState<string>();
  const [longitude, setLongitude] = useState<string>();
  return (
    <NaverMapView
      style={{ width: "100%", height: "100%", flex: 0.3 }}
      showsMyLocationButton={true}
      center={{ ...P0, zoom: 14 }}
      onCameraChange={(e) => console.warn("onCameraChange", JSON.stringify(e))}
      onMapClick={(e) => console.warn("onMapClick", JSON.stringify(e))}
    >
      <Marker coordinate={P0} onClick={() => console.warn("onClick! p0")} />
      <Marker coordinate={P1} onClick={() => console.warn("onClick! p1")} />
      <Circle
        coordinate={P0}
        color={"rgba(255,0,0,0.3)"}
        radius={500}
        onClick={() => console.warn("onClick! circle")}
      />
    </NaverMapView>
  );
}
