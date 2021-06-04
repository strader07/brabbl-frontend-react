import React from 'react';
import { connect } from 'react-redux';
import { Statement, ListStatementWrapper } from './discussion';
import TagSelect from './tag-select';
import {
  DISCUSSION_LIST_SEARCH_BY_ALL_TAGS,
  DISCUSSION_LIST_SEARCH_BY_ANY_TAG,
  DISCUSSION_LIST_SEARCH_BY_SHOW_ALL,
  CAN_ADD_TAG,
} from '../constants';
import moment from 'moment';
import { IntersecArrays, UserHasPermission } from '../utils';


const ListStatement = ListStatementWrapper(Statement);


const ListContainer = (props) => {
  let { discussions, discussion_list,
    app: { tags, discussionFilter, discussionFilterByRelevance }, dispatch, user } = props;
  let tagSelector;
  discussions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  // filter by user selected tags
  if (discussionFilter) {
    discussions = discussions.filter(d => d.tags.indexOf(discussionFilter) > -1);
  }
  // filter by discussion list settings
  if (discussion_list && discussion_list.search_by !== DISCUSSION_LIST_SEARCH_BY_SHOW_ALL) {
    if (discussion_list.search_by === DISCUSSION_LIST_SEARCH_BY_ALL_TAGS) {
      discussions = discussions.filter(
        d => IntersecArrays(d.tags, discussion_list.tags).length === discussion_list.tags.length);
    } else if (discussion_list.search_by === DISCUSSION_LIST_SEARCH_BY_ANY_TAG) {
      discussions = discussions.filter(d => IntersecArrays(d.tags, discussion_list.tags).length > 0);
    }
  }
  let current_date = moment().toJSON();
  // filter by status
  if (discussionFilterByRelevance === 'active') {
    discussions = discussions.filter(d => (
      d.start_time === undefined || d.start_time < current_date) && (
      d.end_time === undefined || d.end_time > current_date));
  } else if (discussionFilterByRelevance === 'non_active') {
    discussions = discussions.filter(d => (
      d.start_time > current_date) || (
      d.end_time < current_date));
  }
  if ((!discussion_list.hide_tag_filter_for_users || UserHasPermission(user, CAN_ADD_TAG))
    && tags.length > 0) {
    tagSelector = (
      <TagSelect tags={tags} dispatch={dispatch} />
    );
  }

  return (
    <div>
      <div className="discussion-list-header">
        {tagSelector}
        {/* <TimeLimitSelect dispatch={dispatch} /> */}
        <div className="clearfix"></div>
      </div>
      <div></div>
      <div className="discussion-list-body">
        {discussions.map(statement =>
          <ListStatement
            key={statement.external_id}
            statement={statement}
            {...props}
          />
        )}
      </div>
    </div>
  );
};

ListContainer.propTypes = {
  discussion_list: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
  discussions: React.PropTypes.array.isRequired,
  user: React.PropTypes.object.required,
  discussion: React.PropTypes.object,
  app: React.PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  discussions: state.discussions,
  modal: state.modal,
  notification: state.notification,
  app: state.app,
  user: state.user,
  customer: state.customer,
});

export default connect(mapStateToProps)(ListContainer);
