import './app.less';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Route, Switch } from 'react-router-dom';
import { hot } from 'react-hot-loader/root';

import { displayEmoji } from 'actions';

const _App = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.message);

  return (
    <div id='main-app' className='bg-moon-gray flex items-center flex-column vh-100' >
      <Helmet>
        <title>React Starter!</title>
        <html lang='en' />
        <meta name='description' content='Awesome react starter' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <link rel='icon' href={require('img/favicon.png')} type='image/png' sizes='32x32' />
      </Helmet>
      <Switch>
        <Route exact path='/' render={() => (
          <div className='tc'>
            <h1 className='f-humungus mv0 mid-gray pointer' onClick={() => dispatch(displayEmoji())}>Show emoji?</h1>
            <p className='f-massive mv0 mid-gray'>{message}</p>
          </div>)}
        />
        <Route render={() => <h1 className='f-humungus mv0 mid-gray' >404</h1>} />
      </Switch>
    </div>
  );
};

export const App = hot(_App);