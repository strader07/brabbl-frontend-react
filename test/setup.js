/* setup.js */

let jsdom = require('jsdom').jsdom;
let exposedProperties = ['window', 'navigator', 'document'];
import register from 'ignore-styles';
register(['.png']);

global.document = jsdom('');
global.window = document.defaultView;
global.window.brabbl = {
  customerId: "12345",
  articleId: "123",
}

import i18next from '../src/js/i18n';

Object.keys(document.defaultView).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.navigator = {
  userAgent: 'node.js',
};
