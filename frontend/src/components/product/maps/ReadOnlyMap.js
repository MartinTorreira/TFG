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
