import {
  SHOW_NOTIFICATION, SHOW_SURVEY, SHOW_STATEMENT, SHOW_ARGUMENT, HIDE_NOTIFICATION, SHOW_MODAL,
  SHOW_MORE_ARGUMENTS, SORT_ARGUMENTS, HIDE_MODAL, UPDATE_DISCUSSION, BOOTSTRAP, FILTER_DISCUSSIONS,
  FILTER_DISCUSSIONS_BY_RELEVANCE, SORT_SURVEY, FETCH_TRANSLATION, PROCESS_DISCUSSION_LIST,
} from '../constants';

import { setBrabblHash } from '../utils';

export function showNotification(text) {
  return {
    type: SHOW_NOTIFICATION,
    text: text,
  };
}

export function hideNotification() {
  return {
    type: HIDE_NOTIFICATION,
    text: '',
  };
}

export function processBootstrap(resp) {
  return {
    type: BOOTSTRAP,
    resp: resp,
  };
}

export function processDiscussionList(resp) {
  return {
    type: PROCESS_DISCUSSION_LIST,
    resp: resp,
  };
}

export function updateDiscussion(resp) {
  return {
    type: UPDATE_DISCUSSION,
    resp: resp,
  };
}

export function showModal(modal, data) {
  return {
    type: SHOW_MODAL,
    modal: modal,
    data: data,
  };
}

export function hideModal() {
  return {
    type: HIDE_MODAL,
  };
}

export function showStatement(id) {
  setBrabblHash();
  return {
    type: SHOW_STATEMENT,
    id: id,
  };
}

export function showArgument(resp) {
  let argument = resp.argument;
  setBrabblHash();
  argument.replies = resp.replies;
  return {
    type: SHOW_ARGUMENT,
    argument: argument,
  };
}

export function showSurvey() {
  return {
    type: SHOW_SURVEY,
  };
}

export function setArgumentSorting(order) {
  return {
    type: SORT_ARGUMENTS,
    order: order,
  };
}

export function setSurveySorting(order) {
  return {
    type: SORT_SURVEY,
    order: order,
  };
}

export function setArgumentLimit(limit) {
  return {
    type: SHOW_MORE_ARGUMENTS,
    limit: limit,
  };
}

export function filterDiscussions(tag) {
  return {
    type: FILTER_DISCUSSIONS,
    tag: tag,
  };
}
export function filterDiscussionsByRelevance(relevance) {
  return {
    type: FILTER_DISCUSSIONS_BY_RELEVANCE,
    relevance: relevance,
  };
}

export function fetchTrans(resp) {
  return {
    type: FETCH_TRANSLATION,
    resp: resp,
  };
}
