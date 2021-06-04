import React from 'react';
import { LoginFormContainer } from '../forms';
import { showModal } from '../../actions/app';
import { bootstrapApp } from '../../actions/async';
import { MODAL_LOGIN, MODAL_PASSWORD, MODAL_SIGNUP } from '../../constants';


let LoginModal = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
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

  onLoginSubmit() {
    this.props.dispatch(bootstrapApp());
  },

  render() {
    return (
      <LoginFormContainer
        onSubmit={this.onLoginSubmit}
        user={this.props.user}
        showLoginModalHandler={this.onShowLoginClick}
        showSignUpModalHandler={this.onShowSignUpClick}
        showLostPasswordModalHandler={this.onShowLostPasswordClick}
        {...this.props}
      />
    );
  },
});

export default LoginModal;
