import API from '../api';
import { processBootstrap, processDiscussionList, updateDiscussion, showArgument, fetchTrans } from './app';


export function bootstrapApp() {
  return dispatch => API.bootstrap().then(resp => dispatch(processBootstrap(resp)));
}

export function getDiscussionList(url) {
  return dispatch => API.get_discussion_list(url).then(resp => dispatch(processDiscussionList(resp)));
}

export function reloadDiscussion() {
  return dispatch =>
    API.get_discussion(window.brabbl.articleId)
      .then(resp => dispatch(updateDiscussion(resp)));
}

export function fetchArgument(id) {
  return dispatch => API.get_argument(id).then(resp => dispatch(showArgument(resp)));
}

export function loadTrans() {
  return dispatch => API.get_trans().then(resp => dispatch(fetchTrans(resp)));
}
