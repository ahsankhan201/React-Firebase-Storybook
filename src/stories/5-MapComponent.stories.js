import React from "react";
import { CustomSelect } from "../shared/components/Dropdown";
import { CustomMapComponent } from "../shared/components/CustomMapComponent";
import { citiesCoords } from "../constants";

export default {
  title: "Map And DropDown Example",
};

const MapAndDropDownExample = () => {
  const [options] = React.useState([
    { label: "Pakistan", value: "Pakistan" },
    { label: "Canada", value: "Canada" },
    { label: "Italy", value: "Italy" },
    { label: "Dubai", value: "Dubai" },
  ]);
  const [coordinates, setCoordinates] = React.useState({
    lat: 32.7502,
    lng: 114.7655,
  });

  const onSelectChange = (value) => {
    const position = citiesCoords[value];
    console.log(position);

    setCoordinates(position);
  };

  return (
    <div>
      <CustomSelect
        options={options}
        onSelectChange={onSelectChange}
        isMulti={false}
      />
      {/* <CustomMapComponent
        lat={coordinates.lat}
        long={coordinates.lng}
        zoom={12}
      /> */}
    </div>
  );
};

export const MapExample = () => {
  return <MapAndDropDownExample />;
};
