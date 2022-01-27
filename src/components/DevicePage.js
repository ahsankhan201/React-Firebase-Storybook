import React, { useState } from 'react';
// import { log } from '../../util/log-util';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import UndoIcon from '@material-ui/icons/Undo';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import { useRouteMatch } from 'react-router';
import { useSelector } from 'react-redux';
import { isLoaded, useFirestoreConnect } from 'react-redux-firebase';
import GeoLocation from './Location/GeoLocation';
import { updateDevice } from '../api/updateDevice';
import { isEmpty, isDate } from 'lodash';
// import { getProjectIds } from '../../config/env';
// import ObjectNotFoundPage from '../ObjectNotFoundPage';
import BreadcrumbNav from './Nav/BreadcrumbsNav';
import Box from '@material-ui/core/Box';
// import SnackbarAlert from '../SnackbarAlert/SnackbarAlert';
import Link from './Nav/Link';
// import { convertDateWithTimezone } from '../../util/date-util';
import Button from '@material-ui/core/Button';
import { auth } from '../firebase';
import { useFirestore } from 'react-redux-firebase';
import { deviceTypes, deviceTypesConfig } from '../config/deviceTypes';
import { diff } from 'deep-object-diff';
const snackbarDefault = { message: undefined, open: false, severity: undefined };

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '75%',
  },
  textField: {
    backgroundColor: '#fed8b1',
    width: '80%',
  },
  card: {
    [theme.breakpoints.down('md')]: {
      maxWidth: '100%',
    },
    [theme.breakpoints.up('md')]: {
      maxWidth: '80%',
    },
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function DevicePage() {
  const match = useRouteMatch('/devices/:deviceId');
  const deviceId = match.params.deviceId;
  // console.log('DevicePage.deviceId', deviceId);
  const classes = useStyles();
  // const userData = useSelector((state) => state.appConfig && state.appConfig.userData);
  const project = useSelector((state) => state.appConfig && state.appConfig.currentProject);
  // const user = useSelector((state) => state.appConfig && state.appConfig.user);
  // const userId = (user && user.uid) || '123';
  // log('DevicePage', deviceId, userData);
  // if(!user) {
  //   return <div id="my-test-id">some text</div>;
  // }
  const userId = '123';
  const storeAsDevice = `beekeeper-devices/${deviceId}`;
  const storeAsUser = `project-user-${userId}`;
  const deviceData = useSelector(({ firestore: { data } }) => data[storeAsDevice]);
  const projectUser = useSelector(({ firestore: { data } }) => data[storeAsUser]);
  let projectIds = ['beekeeper-swartz'];
  const projectId = projectIds[0];
  const isAgrisoundAdmin = false; //userData && userData.email.includes('agrisound.io');

  const queries = [
    {
      collection: 'devices',
      doc: deviceId,
      storeAs: storeAsDevice,
    },
    {
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'users', doc: userId }],
      storeAs: storeAsUser,
    },
  ];

  useFirestoreConnect(queries);

  if (!isLoaded(deviceData, projectUser)) {
    console.log(deviceId, 'loading');
    return 'Loading...';
  }

  const isAdmin = true; //projectUser.userRoles.includes('admin');

  console.log('deviceData', deviceData);
  if (isEmpty(deviceData)) {
    return <div>Device data is empty</div>;
  }

  return (
    <Box justifyContent="flex-start">
      <Grid container justify={'center'} spacing={2}>
        {/*<Grid item xs={12}>*/}
        {/*  <DeviceBreadcrumbs deviceId={deviceId} />*/}
        {/*</Grid>*/}
        <Grid item xs={12}>
          <DeviceCard
            device={deviceData}
            projectId={projectId}
            isAdmin={isAdmin}
            isAgrisoundAdmin={isAgrisoundAdmin}
            project={project}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function DeviceCard({ device, projectId, isAdmin, isAgrisoundAdmin, project }) {
  // console.log('DeviceCard', isAdmin, isAgrisoundAdmin);
  const classes = useStyles();
  const firestore = useFirestore();
  const [expanded, setExpanded] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState(snackbarDefault);
  const [deviceName, setDeviceName] = useState(device.deviceName);
  const [description, setDescription] = useState(device.description);
  const [calibrationOffset, setCalibrationOffset] = useState(device.calibrationOffsetRaw);
  const [calibrationCoefficient, setCalibrationCoefficient] = useState(device.calibrationCoefficientRaw);
  const [gatewayMac, setGatewayMac] = useState(device.gatewayDeviceId);
  const [scaleDeviceId, setScaleDeviceId] = useState(device.scaleDeviceId);
  const [lat, setLat] = useState(device.location && device.location.lat);
  const [lng, setLng] = useState(device.location && device.location.lng);
  const [open, setOpen] = useState(false);
  const collectionName = 'removeDeviceFromProject';
  const showRemoveDeviceButton = false;

  const hasChanges = () => {
    return (
      device.deviceName !== deviceName ||
      (!device.location && lng) ||
      (!device.location && lat) ||
      (device.location && device.location.lng !== lng) ||
      (device.location && device.location.lat !== lat) ||
      device.description !== description ||
      device.gatewayDeviceId !== gatewayMac ||
      device.scaleDeviceId !== scaleDeviceId ||
      device.calibrationOffsetRaw !== calibrationOffset ||
      device.calibrationCoefficientRaw !== calibrationCoefficient
    );
  };

  const removeDeviceAction = () => {
    // setLoading(true);
    const uid = auth.currentUser && auth.currentUser.uid;
    const removeDeviceRequest = {
      dateCreated: new Date(),
      updatedBy: uid,
    };

    firestore
      .collection(collectionName)
      .add(removeDeviceRequest)
      .then((res) => {
        const docId = res.id;
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const handleConfirmOpen = () => {
    setOpen(true);
  };

  const handleConfirmClose = () => {
    setOpen(false);
  };

  const handleConfirmYes = () => {
    removeDeviceAction();
    setOpen(false);
  };
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  let lastActivity = device && device.latestEvent && device.latestEvent.dateCreated.toDate();
  // if (isDate(lastActivity))
  //   lastActivity = convertDateWithTimezone(lastActivity, project.timezone).format('DD MMMM yyyy hh:mm');
  const location =
    device && device.location ? (
      <>
        Lat: {device.location.lat} Long: {device.location.lng}
      </>
    ) : (
      'To be added'
    );

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbar(snackbarDefault);
  };

  return (
    <Card className={classes.card}>
      {/*<SnackbarAlert snackbar={snackbar} handleClose={handleClose} />*/}
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            R
          </Avatar>
        }
        // action={
        //   <IconButton aria-label="settings">
        //     <MoreVertIcon />
        //   </IconButton>
        // }
        title={`Device ID: ${device.deviceId}`}
        subheader={`Last Activity: ${lastActivity}`}
      />
      {/*<CardMedia*/}
      {/*  className={classes.media}*/}
      {/*  image="/static/images/cards/paella.jpg"*/}
      {/*  title="Paella dish"*/}
      {/*/>*/}
      <CardContent>
        {/*<Typography variant="body2" color="textSecondary" component="p">*/}
        {/*  This impressive paella is a perfect party dish and a fun meal to cook together with your*/}
        {/*  guests. Add 1 cup of frozen peas along with the mussels, if you like.*/}
        {/*</Typography>*/}
        <Grid container justify={'center'} spacing={0} style={{ paddingTop: '20px' }}>
          <Grid item xs={6}>
            <Typography paragraph>Device Id:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography paragraph>{device.deviceId}</Typography>
          </Grid>
          {device.deviceType === 'beeHeroOne' && (
            <>
              <Grid item xs={6}>
                <Typography paragraph>Gateway Id:</Typography>
              </Grid>
              <Grid item xs={6}>
                {!editMode && (
                  <Typography paragraph>
                    <Link path={`/devices/${gatewayMac}`} text={gatewayMac} bold={true} />
                  </Typography>
                )}
                {editMode && isAgrisoundAdmin && (
                  <GatewayMac gatewayMac={gatewayMac} setGatewayMac={setGatewayMac} classes={classes} />
                )}
                {editMode && !isAgrisoundAdmin && (
                  <Typography paragraph>
                    <Link
                      path={`/devices/${device.gatewayDeviceId}`}
                      text={device.gatewayDeviceId}
                      bold={true}
                    />
                  </Typography>
                )}
              </Grid>
            </>
          )}
          {device.deviceType === 'beeHeroOne' && (
            <>
              <Grid item xs={6}>
                <Typography paragraph>Barscale Id:</Typography>
              </Grid>
              <Grid item xs={6}>
                {!editMode && (
                  <Typography paragraph>
                    <Link path={`/devices/${scaleDeviceId}`} text={scaleDeviceId} bold={true} />
                  </Typography>
                )}
                {editMode && isAgrisoundAdmin && (
                  <ScaleDeviceId
                    scaleDeviceId={scaleDeviceId}
                    setScaleDeviceId={setScaleDeviceId}
                    classes={classes}
                  />
                )}
                {editMode && !isAgrisoundAdmin && (
                  <Typography paragraph>
                    <Link path={`/devices/${device.scaleDeviceId}`} text={device.scaleDeviceId} bold={true} />
                  </Typography>
                )}
              </Grid>
            </>
          )}
          <Grid item xs={6}>
            <Typography paragraph>Device Name:</Typography>
          </Grid>
          <Grid item xs={6}>
            {!editMode && <Typography paragraph>{device.deviceName}</Typography>}
            {editMode && (
              <DeviceName deviceName={deviceName} setDeviceName={setDeviceName} classes={classes} />
            )}
          </Grid>
          {device.deviceType === deviceTypes.beeHeroOne && (
            <>
              <Grid item xs={6}>
                <Typography paragraph>Sticker Name:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography paragraph>{device.stickerName}</Typography>
              </Grid>
            </>
          )}
          {device.deviceType === deviceTypes.beeHeroGatewayOne && (
            <>
              <Grid item xs={6}>
                <Typography paragraph>Barcode:</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography paragraph>{device.barcode}</Typography>
              </Grid>
            </>
          )}
          <Grid item xs={6}>
            <Typography paragraph>Device Type:</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography paragraph>{deviceTypesConfig[device.deviceType]}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography paragraph>Description:</Typography>
          </Grid>
          <Grid item xs={6}>
            {!editMode && <Typography paragraph>{device.description}</Typography>}
            {editMode && (
              <Description description={description} setDescription={setDescription} classes={classes} />
            )}
          </Grid>
          {device.deviceType === deviceTypes.agsenzeScaleOne && (
            <>
              <Grid item xs={6}>
                <Typography paragraph>Calibration Offset:</Typography>
              </Grid>
              <Grid item xs={6}>
                {!editMode && <Typography paragraph>{device.calibrationOffsetRaw}</Typography>}
                {editMode && (
                  <CalibrationOffset
                    calibrationOffset={calibrationOffset}
                    setCalibrationOffset={setCalibrationOffset}
                    classes={classes}
                  />
                )}
              </Grid>
              <Grid item xs={6}>
                <Typography paragraph>Calibration Coefficient:</Typography>
              </Grid>
              <Grid item xs={6}>
                {!editMode && <Typography paragraph>{device.calibrationCoefficientRaw}</Typography>}
                {editMode && (
                  <CalibrationCoefficient
                    calibrationCoefficient={calibrationCoefficient}
                    setCalibrationCoefficient={setCalibrationCoefficient}
                    classes={classes}
                  />
                )}
              </Grid>
            </>
          )}
          <Grid item xs={6}>
            <Typography paragraph>Location:</Typography>
          </Grid>
          <Grid item xs={6}>
            {!editMode && <Typography paragraph>{location}</Typography>}
            {editMode && (
              <>
                <Latitude lat={lat} setLat={setLat} />
                <Longitude lng={lng} setLng={setLng} />
              </>
            )}
          </Grid>
          <Grid item xs={6}>
            <Typography paragraph>
              Use GPS (using the mobile browser gives the most accurate GPS location)
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <GeoLocation setEditMode={setEditMode} setLat={setLat} setLng={setLng} />
          </Grid>
          {editMode && showRemoveDeviceButton && isAgrisoundAdmin && (
            <Grid item xs={6}>
              <Typography paragraph>Remove device from Project (Admin function only)</Typography>
            </Grid>
          )}
          {editMode && isAgrisoundAdmin && showRemoveDeviceButton && (
            <Grid item xs={6}>
              <div>
                <Button variant="contained" color="primary" onClick={handleConfirmOpen}>
                  Remove
                </Button>
                <Dialog
                  // fullScreen={fullScreen}
                  open={open}
                  onClose={handleConfirmClose}
                  aria-labelledby="responsive-dialog-title"
                >
                  <DialogTitle id="responsive-dialog-title">{"Use Google's location service?"}</DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      Are you really sure you want to remove this device from the project?
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button autoFocus onClick={handleConfirmClose} color="primary">
                      Disagree
                    </Button>
                    <Button onClick={handleConfirmClose} color="primary" autoFocus>
                      Agree
                    </Button>
                  </DialogActions>
                </Dialog>
              </div>
            </Grid>
          )}
        </Grid>
      </CardContent>
      <CardActions disableSpacing>
        {isAdmin && (
          <>
            <IconButton
              aria-label="Edit"
              onClick={async () => {
                if (editMode && hasChanges()) {
                  setLoading(true);
                  let updatedObj = {};
                  updatedObj.description = !description ? '' : description; //description can be set back to empty
                  if (deviceName) updatedObj.deviceName = deviceName;
                  if (calibrationOffset) updatedObj.calibrationOffsetRaw = calibrationOffset;
                  if (calibrationCoefficient) updatedObj.calibrationCoefficientRaw = calibrationCoefficient;
                  updatedObj.location = {};
                  if (lat) updatedObj.location.lat = lat;
                  if (lng) updatedObj.location.lng = lng;
                  if ((gatewayMac === '' || gatewayMac) && isAgrisoundAdmin) {
                    updatedObj.gatewayDeviceId = gatewayMac;
                  }
                  if ((scaleDeviceId === '' || scaleDeviceId) && isAgrisoundAdmin) {
                    updatedObj.scaleDeviceId = scaleDeviceId;
                  }
                  try {
                    const diffs = diff(device, updatedObj);
                    // console.log(`Device changes diffs: ${JSON.stringify(diffs)}`);
                    const auditDescription = `Device changes: ${JSON.stringify(diffs)}`;
                    await updateDevice({ deviceId: device.deviceId, updatedObj, auditDescription });
                    setTimeout(() => {
                      setLoading(false);
                      setSnackbar({ message: 'Saved', open: true, severity: 'success' });
                    }, 500);
                  } catch (err) {
                    setLoading(false);
                    setSnackbar({ message: `Error: ${err.message}`, open: true, severity: 'error' });
                    console.log('DeviceUpdate.err', err);
                  }
                } else {
                  // setSnackbar({ message: 'No changes to save', open: true, severity: 'info' });
                  console.log(`Device has no changes`);
                }
                setEditMode(!editMode);
              }}
            >
              {!editMode && <EditIcon />}
              {editMode && <SaveIcon />}
            </IconButton>
            {editMode && (
              <IconButton onClick={() => setEditMode(false)}>
                <UndoIcon />
              </IconButton>
            )}
          </>
        )}
        {loading && <CircularProgress />}
        {/*<IconButton*/}
        {/*  className={clsx(classes.expand, {*/}
        {/*    [classes.expandOpen]: expanded,*/}
        {/*  })}*/}
        {/*  onClick={handleExpandClick}*/}
        {/*  aria-expanded={expanded}*/}
        {/*  aria-label="show more"*/}
        {/*>*/}
        {/*  <ExpandMoreIcon />*/}
        {/*</IconButton>*/}
      </CardActions>
      {/*<CardCollapse expanded={expanded} />*/}
    </Card>
  );
}

function DeviceBreadcrumbs({ deviceId }) {
  const breadcrumbs = [
    {
      path: '/',
      text: 'Home',
    },
    {
      path: '/projects',
      text: 'Settings',
    },
    {
      path: `/users/${deviceId}`,
      text: 'Device',
    },
  ];
  return <BreadcrumbNav breadcrumbs={breadcrumbs} />;
}

function DeviceName({ deviceName, setDeviceName, classes }) {
  return (
    <TextField
      // style={{ backgroundColor: '#fed8b1' }}
      className={classes.textField}
      required
      id="standard-required"
      value={deviceName}
      onChange={(e) => setDeviceName(e.target.value)}
    />
  );
}

function Description({ description, setDescription, classes }) {
  return (
    <TextField
      // style={{ backgroundColor: '#fed8b1' }}
      className={classes.textField}
      required
      id="standard-required"
      value={description}
      onChange={(e) => setDescription(e.target.value)}
    />
  );
}

function CalibrationOffset({ calibrationOffset, setCalibrationOffset, classes }) {
  return (
    <TextField
      className={classes.textField}
      type="number"
      required
      id="standard-required"
      value={calibrationOffset}
      onChange={(e) => setCalibrationOffset(Number.parseFloat(e.target.value))}
    />
  );
}

function CalibrationCoefficient({ calibrationCoefficient, setCalibrationCoefficient, classes }) {
  return (
    <TextField
      className={classes.textField}
      type="number"
      required
      id="standard-required"
      value={calibrationCoefficient}
      onChange={(e) => setCalibrationCoefficient(Number.parseFloat(e.target.value))}
    />
  );
}

function GatewayMac({ gatewayMac, setGatewayMac, classes }) {
  return (
    <TextField
      className={classes.textField}
      required
      id="standard-required"
      value={gatewayMac}
      onChange={(e) => {
        let value = e.target.value;
        setGatewayMac(value);
      }}
    />
  );
}

function ScaleDeviceId({ scaleDeviceId, setScaleDeviceId, classes }) {
  return (
    <TextField
      className={classes.textField}
      // style={{ backgroundColor: '#fed8b1' }}
      required
      id="standard-required"
      value={scaleDeviceId}
      onChange={(e) => {
        let value = e.target.value;
        setScaleDeviceId(value);
      }}
    />
  );
}

function Latitude({ lat, setLat }) {
  return (
    <TextField
      type="string"
      label="Lat"
      style={{ backgroundColor: '#fed8b1' }}
      required
      id="standard-required"
      value={lat}
      onChange={(e) => {
        const value = e.target.value;
        setLat(value);
        if (value === '-' || value === 'n/' || value === 'n' || value === '') {
          setLat(value);
          return;
        }
        let lat = parseFloat(value);
        if (isNaN(lat)) {
          lat = 'n/a';
        }
        setLat(lat);
      }}
    />
  );
}

function Longitude({ lng, setLng }) {
  return (
    <TextField
      type="string"
      label="Long"
      style={{ backgroundColor: '#fed8b1' }}
      required
      id="standard-required"
      value={lng}
      onChange={(e) => {
        const value = e.target.value;
        setLng(value);
        if (value === '-' || value === 'n/' || value === 'n' || value === '') {
          setLng(value);
          return;
        }
        let lng = parseFloat(value);
        if (isNaN(lng)) {
          lng = 'n/a';
        }
        setLng(lng);
      }}
    />
  );
}

