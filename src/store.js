import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";

import notifyReducer from "./reducers/notifyReducer";
import settingsReducer from "./reducers/settingsReducer";

//Reducers
//@todo
const firebaseConfig = {
  apiKey: "AIzaSyBjFa69-Ae3f21c88QiP3pc9LRlS-N7zpY",
  authDomain: "react-client-panel-48447.firebaseapp.com",
  databaseURL: "https://react-client-panel-48447.firebaseio.com",
  projectId: "react-client-panel-48447",
  storageBucket: "react-client-panel-48447.appspot.com",
  messagingSenderId: "689531298026"
};

//React Redux Firebase config
const rrfConfig = {
  userProfile: "users",
  userFirestoreForProfile: true
};

//Initialize Firebase instance
firebase.initializeApp(firebaseConfig);

//Initialize fire store
const firestore = firebase.firestore();
const settings = { /* your settings... */ timestampsInSnapshots: true };
firestore.settings(settings);

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  notify: notifyReducer,
  settings: settingsReducer
});

//Check for settings in local storage

if (localStorage.getItem("settings") === null) {
  //default Settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };
  //Set to local storage
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

//Initial State
const initialState = {
  settings: JSON.parse(localStorage.getItem("settings"))
};

//Create Store

const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
