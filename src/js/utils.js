import React from 'react';
import i18next from 'i18next';
import object from 'isomorph/object';
import DateTimeInput from 'newforms/DateTimeInput';
import DateTimeField from 'newforms/DateTimeField';
import Datetime from 'react-datetime';
import 'react-datetime/css/react-datetime.css';
import is from 'isomorph/is';
import ValidationError from 'validators';


export const setBrabblHash = () => {
  location.hash = 'widget';
  location.hash = 'brabbl-widget';
};

export const addCSS = (path) => {
  const head = document.head;
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.href = path;
  head.appendChild(link);
};

export const cutUrlHash = (url) => (url !== undefined ? url.split('#')[0] : '');

// get intersection of 2 arrays
export const IntersecArrays = (A, B) => {
  let m = A.length,
    n = B.length,
    c = 0,
    C = [];
  for (let i = 0; i < m; i++) {
    let j = 0,
      k = 0;
    while (B[j] !== A[i] && j < n) j++;
    while (C[k] !== A[i] && k < c) k++;
    if (j !== n && k === c) C[c++] = A[i];
  }
  return C;
};

export function UserHasPermission(user, permission) {
  return user && user.permissions.indexOf(permission) !== -1;
}

export function UseWording(properties, key) {
  let wordings = {},
    barometer_options = properties.customer.barometerOptions,
    current_wording,
    wording = {};

  for (let i = 0; i < barometer_options.length; i++) {
    wordings[barometer_options[i].id] = barometer_options[i];
  }
  if (properties.discussion && 'barometer_wording' in properties.discussion) {
    current_wording = properties.discussion.barometer_wording;
  } else {
    current_wording = properties.customer.default_wording;
  }
  if (wordings && current_wording in wordings) {
    wording = wordings[current_wording];
  }
  let default_wordings = {
    rating_1: i18next.t('very poor'),
    rating_2: i18next.t('poor'),
    rating_3: i18next.t('ok'),
    rating_4: i18next.t('good'),
    rating_5: i18next.t('very good'),
    list_header_contra: i18next.t('CONTRA'),
    list_header_pro: i18next.t('PRO'),
    header_contra: i18next.t('Contra-Argument'),
    header_pro: i18next.t('Pro-Argument'),
    button_short_new_contra: i18next.t('Add new argument'),
    button_short_new_pro: i18next.t('Add new argument'),
    button_new_contra: i18next.t('Write new argument'),
    button_new_pro: i18next.t('Write new argument'),
    survey_statement: i18next.t('Statement'),
    survey_statements: i18next.t('Statements'),
    survey_add_answer_button_top: i18next.t('Write new statement'),
    survey_add_answer_button_bottom: i18next.t('Write new statement'),
    reply_counter: i18next.t('Reply'),
    reply_counter_plural: i18next.t('Replies'),
    statement_header: i18next.t('Reply'),
    statement_list_header: i18next.t('Answer'),
  };
  if (key in wording && wording[key].length > 0) {
    return wording[key];
  } else if (key in default_wordings) {
    return default_wordings[key];
  } else {
    return '';
  }
}
export function UseNotifyWording(properties, key) {
  let wording = properties.customer.notification_wording;
  let default_wordings = {
    notification_registration: i18next.t(`Thank you for your registration!
    You will receive an email with a confirmation link.
    Once you click this, you can join the discussion.`),
    notification_logout: i18next.t('You have been logged out') + '. ' + i18next.t('Come back soon!'),
    notification_signup_required: i18next.t('You must sign in to participate in the discussion'),
    notification_report_posted: i18next.t('Thanks for reporting! We will review that content shortly'),
    notification_message_posted: i18next.t('Thank you for your message') + '. ' + i18next.t(
      'We will consider the amount shortly'),
    notification_message_updated: i18next.t('The argument has been changed'),
    notification_profile_updated: i18next.t('The profile has been updated successfully'),
    notification_reset_password: i18next.t('An email was sent with instructions on how to reset the password'),
  };
  if (key in wording && wording[key].length > 0) {
    return wording[key];
  } else if (key in default_wordings) {
    return default_wordings[key];
  } else {
    return '';
  }
}

let DateTimePickerInput = DateTimeInput.extend({
  formatType: 'Y-m-d H:M:S',
});

DateTimePickerInput.prototype.render = function render(name, value, kwargs) {
  kwargs = object.extend({ attrs: null }, kwargs);
  if (value === null || value === false) {
    value = '';
  }
  let finalAttrs = this.buildAttrs(kwargs.attrs, { type: this.inputType,
                                                  name: name });
  // Hidden inputs can be made controlled inputs by default, as the user
  // can't directly interact with them.
  let valueAttr = (kwargs.controlled || this.isHidden ? 'value' : 'defaultValue');
  if (!(valueAttr === 'defaultValue' && value === '')) {
    finalAttrs[valueAttr] = (value !== '' ? '' + value : value);
  }
  delete(finalAttrs.onChange);
  return (<Datetime
    inputProps={ finalAttrs }
    defaultValue={ finalAttrs[valueAttr] }
    dateFormat="YYYY-MM-DD"
    timeFormat="HH:mm"
  />);
};

let DateTimePickerField = DateTimeField.extend({
  widget: DateTimePickerInput,
  constructor: function DateTimePickerField(kwargs) {
    if (!(this instanceof DateTimePickerField)) { return new DateTimePickerField(kwargs); }
    DateTimeField.call(this, kwargs);
  },
});

DateTimePickerField.prototype.toJavaScript = function toJS(value) {
  let input = document.getElementById(this.widgetAttrs.id);
  if (input) {
    value = input.value;
  }
  if (this.isEmptyValue(value)) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  if (is.Array(value)) {
    if (value.length !== 2) {
      throw ValidationError(this.errorMessages.invalid, { code: 'invalid' });
    }
    if (this.isEmptyValue(value[0]) && this.isEmptyValue(value[1])) {
      return null;
    }
    value = value.join(' ');
  }
  return DateTimeField.prototype.toJavaScript.call(this, value);
};

export default DateTimePickerField;
