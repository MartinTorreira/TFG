import { GoogleMap, MarkerF, useLoadScript } from "@react-google-maps/api";
import React from "react";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const options = {
  scrollwheel: false,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  draggable: false,
};

export default function ReadOnlyMap({ lat, lng }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyC3DouYAkc3zzgNFpRiouHVw2fMChNSnJw",
  });

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={10}
      center={{ lat, lng }}
      options={options}
    >
      <MarkerF position={{ lat, lng }} />
    </GoogleMap>
  );
}
