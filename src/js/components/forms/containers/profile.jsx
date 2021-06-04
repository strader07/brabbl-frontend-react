import React from 'react';
import AvatarEditor from 'react-avatar-editor';
import ProfileForm from '../profile';
import { updateFormErrors } from './utils';
import { showNotification } from '../../../actions/app';
import { bootstrapApp } from '../../../actions/async';
import API from '../../../api';
import i18next from 'i18next';
import { UseNotifyWording } from '../../../utils';


const ProfileFormContainer = React.createClass({

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
    customer: React.PropTypes.object.isRequired,
    initial_data: React.PropTypes.object,
    user: React.PropTypes.object,
    onResetPassword: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    let { initial_data } = this.props;
    let form_data = { onChange: this.forceUpdate.bind(this) };
    if (initial_data) {
      if (!initial_data.bundesland) {
        initial_data.bundesland = '-';
      }
      Object.assign(form_data, { data: initial_data });
    }
    let profile_form = ProfileForm(this.props.customer);
    return {
      form: new profile_form(form_data),
      show_spinner: false,
    };
  },

  handleSubmit(e) {
    e.preventDefault();
    let { form } = this.state;
    let { dispatch, onSubmit } = this.props;
    let isValid = form.validate();
    if (isValid) {
      this.setState({ 'show_spinner': true });
      let imgUrl = this.refs.avatar.getImage();
      let data = form.cleanedData;
      if (imgUrl) {
        data.image = imgUrl;
      }
      API.update_profile(data)
        .then(() => onSubmit())
        .then(() => {
          dispatch(bootstrapApp());
          dispatch(showNotification(UseNotifyWording(this.props, 'notification_profile_updated')));
        })
        .catch(resp => {
          updateFormErrors(form, resp);
          this.forceUpdate();
        });
    }
  },

  render() {
    let { form } = this.state;
    let { onResetPassword, user } = this.props;
    let buttonText = this.state.show_spinner ? (
      <i className="fa fa-spinner fa-spin"></i>) : i18next.t('Update profile');
    return (
      <div className="fullform">
        <div className="fullform-header">
          <h1>{i18next.t('Profile')}</h1>
        </div>
        <div className="fullform-body">
          <form onSubmit={this.handleSubmit}>
            {form.render()}
            <div className="fullform-section avatar-section">
              <h2>{ i18next.t('Profile picture')}</h2>
              <AvatarEditor
                image={user.image.original}
                ref="avatar"
                width={200}
                height={200}
                border={20}
                color={[255, 255, 255, 0.6]}
                scale={1}
              />
              <div className="help-text">
                { i18next.t(
                  'Please drag a picture to the image area to change your profile picture'
                )}
              </div>
            </div>
            <div className="fullform-footer">
              <button
                className=""
                onClick={(e) => onResetPassword(e)}
              >
                { i18next.t('Reset Password')}
              </button>
              <button className="primary" disabled={this.state.show_spinner}>{buttonText}</button>
            </div>
          </form>
        </div>
      </div>
    );
  },
});

export default ProfileFormContainer;
