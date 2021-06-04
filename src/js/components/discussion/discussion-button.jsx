import React from 'react';
import { showModal, hideModal } from '../../actions/app';
import { reloadDiscussion } from '../../actions/async';
import { MODAL_DISCUSSION, CAN_ADD_DISCUSSION } from '../../constants';
import { UserHasPermission } from '../../utils';
import i18next from 'i18next';

const DiscussionButton = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
  },

  onCreateDiscussionSubmit() {
    this.props.dispatch(reloadDiscussion());
  },

  handleShowDiscussionButton() {
    this.props.dispatch(showModal(MODAL_DISCUSSION));
  },

  closeModal() {
    this.props.dispatch(hideModal());
  },

  render() {
    let content;
    let { user } = this.props;
    if (UserHasPermission(user, CAN_ADD_DISCUSSION)) {
      content = (
        <button className="primary" onClick={this.handleShowDiscussionButton}>
          { i18next.t('Create discussion') }
        </button>
      );
    }
    return (
      <div>
        {content}
      </div>
    );
  },
});

export default DiscussionButton;
