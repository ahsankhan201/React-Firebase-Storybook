import React from "react";
import { compose, withProps, lifecycle } from "recompose";
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Proptypes from "prop-types";
import { API_KEY } from "../../constants";

export const CustomMapComponent = compose(
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentDidMount() {
      this.setState({
        zoomToMarkers: (map) => {
          console.log("Zoom to markers");
          const bounds = new window.google.maps.LatLngBounds();
          console.log(bounds);
          map?.props.children.forEach((child) => {
            if (child.type === Marker) {
              bounds.extend(
                new window.google.maps.LatLng(
                  child.props.position.lat,
                  child.props.position.lng
                )
              );
            }
          });
          map?.fitBounds(bounds);
        },
      });
    },

    componentWillReceiveProps(nextProps) {
      if (this.props.markers !== nextProps.markers) {
        this.setState({
          zoomToMarkers: (map) => {
            console.log("Update to markers");
            const bounds = new window.google.maps.LatLngBounds();
            console.log(bounds);
            map?.props.children.forEach((child) => {
              if (child.type === Marker) {
                bounds.extend(
                  new window.google.maps.LatLng(
                    child.props.position.lat,
                    child.props.position.lng
                  )
                );
              }
            });
            map?.fitBounds(bounds);
          },
        });
      }
    },
  }),
  withScriptjs,
  withGoogleMap
)(({ zoomToMarkers, zoom, markers, label }) => {
  return (
    <>
      <GoogleMap
        defaultZoom={10}
        ref={zoomToMarkers}
        defaultCenter={{ lat: -34.397, lng: 150.644 }}
      >
        {markers?.map((mark, i) => (
          <Marker
            key={i}
            position={
              label === "deviceName" ? mark.location : mark.siteLocation
            }
          />
        ))}
      </GoogleMap>
    </>
  );
});

CustomMapComponent.propTypes = {
  lat: Proptypes.string,
  lng: Proptypes.string,
  zoom: Proptypes.number,
  markers: Proptypes.array,
};
