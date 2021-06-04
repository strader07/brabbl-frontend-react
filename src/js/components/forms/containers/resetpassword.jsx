import React from 'react';
import { showNotification } from '../../../actions/app';
import forms from 'newforms';
import API from '../../../api';
import PasswordResetForm from '../resetpassword';
import { updateFormErrors } from './utils';
import i18next from 'i18next';
import { UseNotifyWording } from '../../../utils';

const ResetPasswordFormContainer = React.createClass({

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
    customer: React.PropTypes.object,
    closeModalHandler: React.PropTypes.func.isRequired,
    showLoginModalHandler: React.PropTypes.func.isRequired,
  },

  onSubmit(e) {
    let form = this.refs.passwordResetForm.getForm();
    let isValid = form.validate();
    e.preventDefault();
    if (isValid) {
      this.resetPassword(form);
    }
  },

  resetPassword(form) {
    API.reset_password(form.cleanedData.email)
      .then(() => {
        this.props.dispatch(showNotification(UseNotifyWording(this.props, 'notification_reset_password')));
        this.props.closeModalHandler();
      })
      .catch(resp => {
        updateFormErrors(form, resp);
        this.forceUpdate();
      });
  },

  render() {
    return (
      <div className="fullform">
        <div className="fullform-header">
          <h1>{ i18next.t('Reset Password') }</h1>
        </div>
        <div className="fullform-body">
          <form onSubmit={this.onSubmit}>
            <forms.RenderForm form={PasswordResetForm()} ref="passwordResetForm" />
            <div className="fullform-footer">
              <button className="primary" onClick={this.submit}>{ i18next.t('Reset Password') }</button>
              <button onClick={this.props.showLoginModalHandler}>{ i18next.t('Back') }</button>
            </div>
          </form>
        </div>
      </div>
    );
  },
});

export default ResetPasswordFormContainer;
