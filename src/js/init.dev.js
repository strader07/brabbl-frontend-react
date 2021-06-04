import i18next from './i18n';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './components/app';
import '../css/themes/vorwaerts.scss';
import '../fonts/font-awesome.scss';

const store = configureStore();
console.log(i18next);

render(
  <Provider store={store}>
    <div>
      <App />
    </div>
  </Provider>,
  document.getElementById('brabbl-widget')
);
