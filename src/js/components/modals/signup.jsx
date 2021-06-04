import React from 'react';
import { SignUpFormContainer } from '../forms';
import { showNotification, showModal } from '../../actions/app';
import { bootstrapApp } from '../../actions/async';
import { MODAL_LOGIN, MODAL_SIGNUP,
  MODAL_PASSWORD } from '../../constants';
import { UseNotifyWording } from '../../utils';


let SignupModal = React.createClass({

  propTypes: {
    customer: React.PropTypes.object,
  },

  onShowLoginClick(e) {
    e.preventDefault();
    this.props.dispatch(showModal(MODAL_LOGIN));
  },

  onShowSignUpClick(e) {
    e.preventDefault();
    this.props.dispatch(showModal(MODAL_SIGNUP));
  },

  onShowLostPasswordClick(e) {
    e.preventDefault();
    this.props.dispatch(showModal(MODAL_PASSWORD));
  },

  onSignUpSubmit() {
    this.props.dispatch(bootstrapApp());
    this.props.dispatch(
      showNotification(UseNotifyWording(this.props, 'notification_registration'))
    );
  },

  render() {
    return (
      <SignUpFormContainer
        onSubmit={this.onSignUpSubmit}
        customer={this.props.customer}
        showLoginModalHandler={this.onShowLoginClick}
        showSignUpModalHandler={this.onShowSignUpClick}
        showLostPasswordModalHandler={this.onShowLostPasswordClick}
      />
    );
  },
});

export default SignupModal;
