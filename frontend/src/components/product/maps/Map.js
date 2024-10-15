import { useState, useRef } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { MarkerF } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const options = {
  scrollwheel: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 43.45,
  lng: -80.49,
};

export default function Map({
  isOpen,
  closeModal,
  onLocationSelect,
  selected,
  setSelected,
}) {
  // const { isLoaded } = useLoadScript({
  //   googleMapsApiKey: "AIzaSyC3DouYAkc3zzgNFpRiouHVw2fMChNSnJw",
  //   libraries: ["places"],
  // });

  const mapRef = useRef();

  const handleMapClick = (event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setSelected({ lat, lng });
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
    }
  };

  const handleSelectLocation = () => {
    if (selected) {
      onLocationSelect(selected.lat, selected.lng);
    }
  };

  //  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-2 w-full max-w-lg relative">
            <span
              className="absolute top-2 right-2 cursor-pointer text-2xl"
              onClick={closeModal}
            >
              &times;
            </span>
            <div className="places-container mt-4 mb-4">
              <PlacesAutocomplete setSelected={setSelected} />
            </div>

            <GoogleMap
              mapContainerStyle={containerStyle}
              zoom={10}
              center={selected || center}
              onClick={handleMapClick}
              onLoad={(map) => (mapRef.current = map)}
              options={options}
            >
              {selected && <MarkerF position={selected} />}
            </GoogleMap>

            <button
              onClick={handleSelectLocation}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
            >
              Select Location
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const PlacesAutocomplete = ({ setSelected }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
  };

  return (
    <Combobox onSelect={handleSelect}>
      <ComboboxInput
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="border border-gray-300 rounded-md p-2 w-full"
        placeholder="Buscar una dirección"
      />
      <ComboboxPopover>
        <ComboboxList>
          {status === "OK" &&
            data.map(({ place_id, description }) => (
              <ComboboxOption
                key={place_id}
                value={description}
                className="cursor-pointer hover:bg-gray-200"
              />
            ))}
        </ComboboxList>
      </ComboboxPopover>
    </Combobox>
  );
};
