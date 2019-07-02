import 'theme/theme.less';

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { StaticRouter, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { App } from './components/app';
import { rootReducer } from './reducers';
import { initialize } from 'actions';

export const renderReact = async ({ req }) => {

  const store = createStore(rootReducer, compose(applyMiddleware(thunk)));
  await store.dispatch(initialize());

  const body = ReactDOMServer.renderToString(
    <Provider store={store}>
      <StaticRouter location={req.url} >
        <Route component={App} />
      </StaticRouter>
    </Provider>
  );

  const helmet = Helmet.renderStatic();
  const state = store.getState();

  return { body, helmet, state };
};