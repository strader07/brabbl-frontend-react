import React from 'react';
import forms from 'newforms';
import { showModal } from '../../../actions/app';
import API from '../../../api';
import LoginForm from '../login';
import { updateFormErrors } from './utils';
import { MODAL_SIGNUP, MODAL_PASSWORD } from '../../../constants';
import SocialButtons from './social_buttons';
import MarkupWording from '../../markup_wording';
import i18next from 'i18next';


const LoginFormContainer = React.createClass({

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    showSignUpModalHandler: React.PropTypes.func.isRequired,
    showLostPasswordModalHandler: React.PropTypes.func.isRequired,
  },

  onSubmit(e) {
    let cleaned_data;
    let form = this.refs.loginForm.getForm();
    let isValid = form.validate();
    e.preventDefault();
    if (isValid) {
      cleaned_data = form.cleanedData;
      API.login(cleaned_data.username, cleaned_data.password)
        .then(resp => {
          if (resp.loggedIn) {
            this.props.onSubmit();
          } else {
            updateFormErrors(form, resp);
            this.forceUpdate();
          }
        });
    }
  },

  showSignUpModal(e) {
    e.preventDefault();
    this.props.dispatch(showModal(MODAL_SIGNUP));
  },

  showPasswordModal(e) {
    e.preventDefault();
    this.props.dispatch(showModal(MODAL_PASSWORD));
  },

  render() {
    let login_form = LoginForm();
    return (
      <div className="fullform">
        <div className="fullform-header login-header">
          <h1><MarkupWording {...this.props} wording="login_title" /></h1>
          <div className="login-text"><MarkupWording {...this.props} wording="login_text" /></div>
        </div>
        <SocialButtons />
        <div className="fullform-body login-body">
          <form onSubmit={ this.onSubmit }>
            <forms.RenderForm form={ login_form } ref="loginForm" />
            <div className="fullform-footer login-footer">
              <button className="primary">{ i18next.t('Sign In')}</button>
              <button className="right-button" onClick={this.showSignUpModal}>
                { i18next.t('Create a new account')}
              </button>
            </div>
          </form>
          <div className="forgot-password-button">
            <a onClick={this.showPasswordModal}>{ i18next.t('Forgot your password?')}</a>
          </div>
        </div>
      </div>
    );
  },
});

export default LoginFormContainer;
