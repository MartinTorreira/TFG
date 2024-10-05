import React, { useState } from "react";
import Autocomplete from "./Autocomplete";
import Map from "./Map";

const MapComponent = () => {
  const [selectedPlace, setSelectedPlace] = useState(null);

  return (
    <div>
      <Autocomplete setSelectedPlace={setSelectedPlace} />
      <Map selectedPlace={selectedPlace} />
    </div>
  );
};

export default MapComponent;
