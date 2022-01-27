import React from 'react';
import thunk from 'redux-thunk';
import ReactDOM from 'react-dom';
import './index.css';
import firebase from './firebase';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import { createFirestoreInstance } from 'redux-firestore';
import { rootReducer } from './reducers/combined-reducers';
// import { composeWithDevTools } from 'redux-devtools-extension';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// import * as serviceWorker from './serviceWorker';
// import { AuthProvider } from './components/PrivateRoute/Auth'; Dan - this might be reinstated later on

const rrfConfig = {
    userProfile: 'users',
    useFirestoreForProfile: true,
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
// const store = createStore(rootReducer, composeWithDevTools());
// const store = createStore(rootReducer, { appConfig: { limit: 10 } });
// console.log('store', store.getState());

const rrfProps = {
    firebase,
    config: rrfConfig,
    dispatch: store.dispatch,
    createFirestoreInstance,
};
ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            {/*<AuthProvider>*/}
            <ReactReduxFirebaseProvider {...rrfProps}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ReactReduxFirebaseProvider>
            {/*</AuthProvider>*/}
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
