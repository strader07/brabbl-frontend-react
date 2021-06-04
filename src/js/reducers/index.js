import { combineReducers } from 'redux';
import notification from './notification';
import translators from './translators';
import modal from './modal';
import argument from './argument';
import { discussions, discussion, discussion_list } from './discussion';
import user from './user';
import customer from './customer';
import { SHOW_STATEMENT, SHOW_ARGUMENT, SHOW_SURVEY, BOOTSTRAP, PROCESS_DISCUSSION_LIST,
  SORT_ARGUMENTS, SHOW_MORE_ARGUMENTS, BY_RELEVANCE, FILTER_DISCUSSIONS, FILTER_DISCUSSIONS_BY_RELEVANCE,
  SORT_SURVEY, FETCH_TRANSLATION } from '../constants';


const initialState = {
  statementId: null,
  loading: true,
  isDiscussed: false,
  tags: [],
  discussionFilter: null,
  view: window.brabbl.view || 'detail',
  articleId: window.brabbl.articleId || null,
  argumentOrder: BY_RELEVANCE,
  surveyOrder: BY_RELEVANCE,
  argumentLimit: 999,
  argumentId: null,
};

function app(state = initialState, action) {
  switch (action.type) {
    case SHOW_STATEMENT:
      return { ...state, statementId: action.id, argumentId: null };
    case SHOW_ARGUMENT:
      return {
        ...state,
        argumentId: action.argument.id,
      };
    case SHOW_SURVEY:
      return { ...state, statementId: null, argumentId: null };
    case SORT_ARGUMENTS:
      return { ...state, argumentOrder: action.order };
    case SORT_SURVEY:
      return { ...state, surveyOrder: action.order };
    case SHOW_MORE_ARGUMENTS:
      return { ...state, argumentLimit: action.limit };
    case FILTER_DISCUSSIONS:
      return { ...state, discussionFilter: action.tag };
    case FILTER_DISCUSSIONS_BY_RELEVANCE:
      return { ...state, discussionFilterByRelevance: action.relevance };
    case FETCH_TRANSLATION:
      return { ...state, translate: action.resp };
    case PROCESS_DISCUSSION_LIST:
      return { ...state, discussion_list: action.resp };
    case BOOTSTRAP:
      return {
        ...state,
        loading: false,
        isDiscussed: action.resp.discussion !== null,
        tags: action.resp.tags.map(t => t.name),
      };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  app,
  discussion,
  discussions,
  discussion_list,
  argument,
  notification,
  user,
  customer,
  modal,
  translators,
});

export default rootReducer;
