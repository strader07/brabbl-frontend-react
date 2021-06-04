require('es6-promise').polyfill();
import axios from 'axios';
import Cookie from 'tiny-cookie';
import config from './config';
import moment from 'moment';
import { addCSS } from './utils';

let API = {

  get(url) {
    return axios.get(`${config.ApiBaseUrl}${url}`, API.get_config());
  },

  post(url, data) {
    return axios.post(`${config.ApiBaseUrl}${url}`, data, API.get_config());
  },

  delete(url) {
    return axios.delete(`${config.ApiBaseUrl}${url}`, API.get_config());
  },

  patch(url, data) {
    return axios.patch(`${config.ApiBaseUrl}${url}`, data, API.get_config());
  },

  get_config() {
    return {
      headers: {
        'X-Brabbl-Token': window.brabbl.customerId,
        'Authorization': Cookie.get('brabbl-token'),
      },
    };
  },

  get_discussions() {
    return API.get('discussions/')
      .then(resp => ({ discussions: resp.data }))
      .catch(() => ({ discussions: null }));
  },

  get_discussion(external_id) {
    let urlencode = (strings, value) => strings[0] + encodeURIComponent(value);
    if (typeof external_id === 'string') {
      external_id = external_id.split('#')[0];
    }
    return API.get(urlencode`discussions/detail/?external_id=${external_id}`)
      .then(resp => ({ discussion: resp.data }))
      .catch(() => ({ discussion: null }));
  },

  delete_discussion(external_id) {
    let urlencode = (strings, value) => strings[0] + encodeURIComponent(value);
    if (typeof external_id === 'string') {
      external_id = external_id.split('#')[0];
    }
    return API.delete(urlencode`discussions/1/?external_id=${external_id}`)
      .then(resp => ({ discussion: resp.data }))
      .catch(() => ({ discussion: null }));
  },

  create_discussion(data) {
    return this.post('discussions/', data);
  },

  update_discussion(external_id, changed_fields) {
    return this.patch('discussions/detail/?external_id=' +
        encodeURIComponent(external_id), changed_fields);
  },

  get_discussion_list(url) {
    return API.get(`discussion_list/detail/?url=${url}`)
      .then(resp => ({ discussion_list: resp.data ? resp.data : {} }))
      .catch(() => ({ discussion_list: {} }));
  },

  create_discussion_list(data) {
    return this.post('discussion_list/', data);
  },

  update_discussion_list(url, changed_fields) {
    return this.patch('discussion_list/detail/?url=' +
        encodeURIComponent(url), changed_fields);
  },

  bootstrap() {
    let account,
      discussions,
      discussion,
      barometerOptions,
      customer;
    return this.get_account()
      .then(resp => {
        account = resp;
        return this.get_barometer_options();
      })
      .then(resp => {
        barometerOptions = resp.data;
        return this.get_discussions();
      })
      .then(resp => {
        discussions = resp.discussions;
        return this.get_discussion(window.brabbl.articleId);
      })
      .then(resp => {
        discussion = resp.discussion;
        return this.get_customer_data();
      })
      .then(resp => {
        customer = resp.data;
        this.set_theme(resp.data.theme);
        customer.barometerOptions = barometerOptions;
        return this.get_notification_wording_data(customer.notification_wording);
      })
      .then(resp => {
        let notification_wording = {},
          markdown_wording = {};
        if (resp.data) {
          let wording_list = resp.data.notification_wording_messages;
          let markdown_wording_list = resp.data.markdown_wording_messages;
          for (let i = 0; i < wording_list.length; i++) {
            notification_wording[wording_list[i].key] = wording_list[i].value;
          }
          for (let i = 0; i < markdown_wording_list.length; i++) {
            markdown_wording[markdown_wording_list[i].key] = markdown_wording_list[i].value;
          }
        }
        customer.notification_wording = notification_wording;
        customer.markdown_wording = markdown_wording;
        return this.get_tags();
      })
      .then(resp => ({
        user: account.user,
        customer: customer,
        discussions: discussions,
        discussion: discussion,
        tags: resp.data,
      }));
  },

  get_account() {
    if (Cookie.get('brabbl-token')) {
      return API.get('account/')
        .then(resp => ({
          'user': resp.data,
        }))
        .catch(() => {
          Cookie.remove('brabbl-token');
          return { 'user': null };
        });
    } else {
      return new Promise(function emptyfunc(resolve) {
        resolve();
      }).then(() => ({
        'user': null,
      }));
    }
  },

  get_argument(id) {
    let replies,
      argument;
    return API.get(`arguments/${id}/`)
      .then(resp => {
        argument = resp.data;
        return API.get(`arguments/${id}/replies/`);
      })
      .then(resp => {
        replies = resp.data;
        return {
          argument: argument,
          replies: replies,
        };
      });
  },

  reset_password(email) {
    return this.post('account/reset/', { email: email });
  },


  confirm_data_policy() {
    return this.post('account/confirm-data-policy/');
  },


  register_user(user_data) {
    return this.post('account/register/', user_data);
  },

  vote_statement(statement_id, rating) {
    return this.post('statements/' + statement_id + '/vote/', { 'rating': rating });
  },

  change_statement_status(statement_id, status) {
    return this.post('statements/' + statement_id + '/change_status/', { 'status': status });
  },

  rate_argument(argument_id, rating) {
    return this.post('arguments/' + argument_id + '/rate/', { 'rating': rating });
  },

  delete_argument(argument_id) {
    return this.delete('arguments/' + argument_id + '/');
  },

  change_argument_status(argument_id, status) {
    return this.post('arguments/' + argument_id + '/change_status/', { 'status': status });
  },

  flag(data) {
    return this.post('flag/', data);
  },

  get_barometer_options() {
    return this.get('wordings/');
  },

  get_customer_data() {
    return this.get('customer/');
  },

  get_notification_wording_data(n_wording_id) {
    if (n_wording_id) {
      return this.get('notification_wording/' + n_wording_id + '/');
    } else {
      return new Promise(function emptyfunc(resolve) {
        resolve();
      }).then(() => ({
        'notification_wording': {},
      }));
    }
  },

  get_tags() {
    return this.get('tags/');
  },

  get_trans() {
    return API.get('translation/')
      .then(resp => {
        moment.locale(resp.data.language);
        return resp.data.translations;
      })
      .catch(() => ({ translators: null }));
  },

  set_theme(customer_theme) {
    let theme = customer_theme || config.defaultTheme;
    addCSS(`${config.CSSBaseUrl}${theme}.css`);
  },

  login(username, password) {
    return this.post('account/login/', { 'username': username, 'password': password })
      .then(resp => {
        Cookie.set('brabbl-token', 'Token ' + resp.data.token);
        resp.loggedIn = true;
        return resp;
      })
      .catch(resp => {
        resp.loggedIn = false;
        return resp;
      });
  },

  logout() {
    API.get('account/logout/');
    Cookie.remove('brabbl-token');
  },

  update_profile(user) {
    return this.patch('account/', user);
  },

  create_argument(argument) {
    return this.post('arguments/', argument);
  },

  update_argument(argument_id, changed_fields) {
    return this.patch('arguments/' + argument_id + '/', changed_fields);
  },

  create_statement(statement) {
    return this.post('statements/', statement);
  },

  update_statement(statement_id, data) {
    return this.patch('statements/' + statement_id + '/', data);
  },

  delete_statement(statement_id) {
    return this.delete('statements/' + statement_id + '/');
  },
};

export default API;
