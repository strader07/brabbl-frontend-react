import React from 'react';
import { DiscussionListFormContainer } from '../forms';
import { bootstrapApp, getDiscussionList } from '../../actions/async';
import { hideModal } from '../../actions/app';
import i18next from 'i18next';

let DiscussionListModal = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    customer: React.PropTypes.object,
    discussion_list: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.array]),
  },

  onSubmit() {
    this.props.dispatch(bootstrapApp());
    this.props.dispatch(getDiscussionList(window.location.href));
  },

  onCancel(e) {
    e.preventDefault();
    this.props.dispatch(hideModal());
  },

  render() {
    let { user, customer, discussion_list } = this.props;
    if (Object.keys(discussion_list).length === 0) {
      discussion_list = null;
    }
    return (
      <div className="fullform discussion-list-create">
        <div className="fullform-header">
          <h1>{ i18next.t('Edit List') }</h1>
        </div>
        <div className="fullform-body">
          <DiscussionListFormContainer
            username={user.username}
            customer={customer}
            initial_data={discussion_list}
            onSubmit={this.onSubmit}
            onCancel={this.onCancel}
          />
        </div>
      </div>
    );
  },
});

export default DiscussionListModal;
