import React from 'react';
import { ResetPasswordFormContainer } from '../forms';
import { showModal, hideModal } from '../../actions/app';
import { reloadDicussion } from '../../actions/async';
import { MODAL_LOGIN, MODAL_SIGNUP } from '../../constants';


let PasswordResetModal = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
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
    this.props.dispatch(showModal(this.renderLostPasswordModal));
  },

  onLoginSubmit(e) {
    e.preventDefault();
    this.props.dispatch(reloadDicussion());
  },

  render() {
    let { dispatch } = this.props;
    return (
      <ResetPasswordFormContainer
        onSubmit={this.onLoginSubmit}
        user={this.props.user}
        customer={this.props.customer}
        dispatch={dispatch}
        closeModalHandler={() => dispatch(hideModal())}
        showLoginModalHandler={this.onShowLoginClick}
        showSignUpModalHandler={this.onShowSignUpClick}
        showLostPasswordModalHandler={this.onShowLostPasswordClick}
      />
    );
  },
});

export default PasswordResetModal;
