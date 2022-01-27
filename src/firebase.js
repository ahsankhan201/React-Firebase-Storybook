import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/performance';


const config = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

const firebaseApp = firebase.initializeApp(config);
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();
export const auth = firebase.auth();
export const storage = firebase.storage();
export const performance = firebase.performance();

// eslint-disable-next-line no-restricted-globals
if (location.hostname === 'localhost') {
  // firestore.useEmulator('localhost', 8080);
  // auth.useEmulator('http://localhost:9099/');
}

export default firebase;
