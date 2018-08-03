import React from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { BrowserRouter, Route } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import ReduxPromise from 'redux-promise';

import reducers from './reducers';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const store = createStore(
  reducers,
  applyMiddleware(logger, ReduxPromise),
);

/* eslint-disable */
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <MuiThemeProvider>
          <Route path='/' component={App} />
        </MuiThemeProvider>
      </div>
    </BrowserRouter>
  </Provider>
  , document.getElementById('root'),
);
registerServiceWorker();
