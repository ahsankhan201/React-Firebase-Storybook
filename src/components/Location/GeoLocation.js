import React, { useRef, useState } from 'react';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { format } from 'date-fns';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

const GeoLocation = ({ editMode = true, setEditMode, setLat, setLng, setSnackbar }) => {
  const debugMode = false;
  const innerRef = useRef();
  const [lastUpdated, setLastUpdated] = useState();
  const [loading, setLoading] = useState(false);
  const [gpsLocation, setGpsLocation] = useState({
    coords: {
      latitude: 'n/a',
      longitude: 'n/a',
    },
  });

  const getLocation = () => {
    innerRef.current && innerRef.current.getLocation();
  };

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
  };

  const getLocation2 = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      function (position) {
        console.log('getCurrentPosition', position);
        const lat = position.coords.latitude; //.toFixed(6);
        const lng = position.coords.longitude; //.toFixed(6);
        setGpsLocation(position);
        setTimeout(() => {
          setLoading(false);
          setLat(lat);
          setLng(lng);
          setEditMode(true);
          setLastUpdated(new Date());
        }, 250);
      },
      function (error) {
        console.log('Error Code = ' + error.code + ' - ' + error.message);
        if (setSnackbar) {
          setSnackbar({
            message: 'Timeout: could not retrieve the location',
            open: true,
            severity: 'info',
          });
        }
        setLoading(false);
      },
      options
    );
  };

  return (
    <Grid container justify={'center'} spacing={0} style={{ paddingTop: '5px' }}>
      <Grid item xs={12}>
        <Box display="flex">
          <Button
            disabled={!editMode || loading}
            color="primary"
            variant="contained"
            onClick={getLocation2}
            style={{ marginRight: 10 }}
          >
            Get location
          </Button>
          {loading && <CircularProgress size={30} />}
        </Box>
      </Grid>
      {debugMode && (
        <Grid item xs={6}>
          Lat: {gpsLocation.coords.latitude} Long: {gpsLocation.coords.longitude}
        </Grid>
      )}
      {debugMode && (
        <Grid item xs={6}>
          Last Updated: {lastUpdated && format(lastUpdated, 'dd MMM HH:mm:ss')}
        </Grid>
      )}
    </Grid>
  );
};

export default GeoLocation;
