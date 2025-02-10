import { useRef, useEffect } from "react";
import MapView from "react-native-maps";

const MyMap = ({ location }) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.001, // Mais zoom
        longitudeDelta: 0.001,
      }, 1000); // 1000ms (1s) de animação
    }
  }, [location]);

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
    />
  );
};

export default MyMap;