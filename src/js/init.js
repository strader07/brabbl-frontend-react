import moment from 'moment';
import 'classlist-polyfill';
import config from './config';
import { addCSS } from './utils';

moment.locale('en');

addCSS(`${config.CSSBaseUrl}main.css`);

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./init.prod');
} else {
  module.exports = require('./init.dev');
}
