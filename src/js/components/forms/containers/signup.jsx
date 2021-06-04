import React from 'react';
import forms from 'newforms';
import SignUpForm from '../signup';
import API from '../../../api';
import { updateFormErrors } from './utils';
import SocialButtons from './social_buttons';
import i18next from 'i18next';
import MarkdownWording from '../../markup_wording';

const SignUpFormContainer = React.createClass({

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
    customer: React.PropTypes.object.isRequired,
    showSignUpModalHandler: React.PropTypes.func.isRequired,
    showLoginModalHandler: React.PropTypes.func.isRequired,
  },

  handleSubmit(e) {
    e.preventDefault();
    let cleanedData;
    let form = this.refs.signUpForm.getForm();
    let isValid = form.validate();
    if (isValid) {
      cleanedData = form.cleanedData;
      API.register_user(cleanedData)
        .then(() => {
          API.login(cleanedData.username, cleanedData.password)
            .then(() => {
              this.props.onSubmit(cleanedData);
            });
        })
        .catch((resp) => {
          updateFormErrors(form, resp);
          this.forceUpdate();
        });
    }
  },

  render() {
    return (
      <div className="fullform">
        <div className="fullform-header">
          <h1><MarkdownWording {...this.props} wording="sign_up_title" /></h1>
        </div>
        <SocialButtons />
        <div className="fullform-body">
          <form onSubmit={this.handleSubmit}>
            <forms.RenderForm form={SignUpForm(this.props.customer)} ref="signUpForm" />
            <p className="sign-up-text">
              <MarkdownWording {...this.props} wording="sign_up_text" />
            </p>
            <div className="fullform-footer login-footer">
              <button className="primary">{ i18next.t('Register') }</button>
              <button className="right-button" onClick={this.props.showLoginModalHandler}>
                { i18next.t('Already have an account?') }
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  },
});

export default SignUpFormContainer;
