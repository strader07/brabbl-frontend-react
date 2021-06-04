import { BOOTSTRAP, UPDATE_DISCUSSION, PROCESS_DISCUSSION_LIST } from '../constants';


function discussion(state = null, action) {
  switch (action.type) {
    case BOOTSTRAP:
      return action.resp.discussion;
    case UPDATE_DISCUSSION:
      return action.resp.discussion;
    default:
      return state;
  }
}

function discussions(state = [], action) {
  switch (action.type) {
    case BOOTSTRAP:
      return action.resp.discussions;
    default:
      return state;
  }
}

function discussion_list(state = [], action) {
  switch (action.type) {
    case PROCESS_DISCUSSION_LIST:
      return action.resp.discussion_list;
    default:
      return state;
  }
}
export { discussion, discussions, discussion_list };
