import React from 'react';
import { DiscussionFormContainer } from '../forms';
import { bootstrapApp } from '../../actions/async';
import { hideModal, showModal } from '../../actions/app';
import i18next from 'i18next';
import moment from 'moment';

let DiscussionModal = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    customer: React.PropTypes.object,
    discussion: React.PropTypes.object,
  },

  onSubmit() {
    this.props.dispatch(bootstrapApp());
  },


  onDelete(e) {
    e.preventDefault();
    this.props.dispatch(
      showModal('DELETE_DISCUSSION', { discussion: this.props.discussion })
    );
  },

  onCancel(e) {
    e.preventDefault();
    this.props.dispatch(hideModal());
  },

  render() {
    let { user, customer, discussion } = this.props;
    if (typeof discussion !== 'undefined') {
      if (discussion.start_time) {
        discussion.start_time = moment(discussion.start_time).format('YYYY-MM-DD HH:mm');
      }
      if (discussion.end_time) {
        discussion.end_time = moment(discussion.end_time).format('YYYY-MM-DD HH:mm');
      }
    }
    return (
      <div className="fullform discussion-create">
        <div className="fullform-header">
          <h1>{discussion ? i18next.t('Edit discussion') : i18next.t('Add new Discussion')}</h1>
        </div>
        <div className="fullform-body">
          <DiscussionFormContainer
            username={user.username}
            customer={customer}
            initial_data={discussion}
            onSubmit={this.onSubmit}
            onCancel={this.onCancel}
            onDelete={this.onDelete}
          />
        </div>
      </div>
    );
  },
});

export default DiscussionModal;
