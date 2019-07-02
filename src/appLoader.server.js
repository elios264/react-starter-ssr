import 'theme/theme.less';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { App } from './components/app';
import { rootReducer } from './reducers';


export const serverRender = ({} = {}) => {

  const store = createStore(rootReducer, compose(applyMiddleware(thunk)));
  //store.dispatch(initialize()) we need to await this.

  const body = ReactDOMServer.renderToString(
    <Provider store={store}>
      <MemoryRouter>
        <Route component={App} />
      </MemoryRouter>
    </Provider>
  );

  const helmet = Helmet.renderStatic();
  const state = store.getState();

  return { body, helmet, state };
};