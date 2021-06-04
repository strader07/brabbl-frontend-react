import React from 'react';
import { ProfileFormContainer } from '../forms';
import { showNotification, hideModal } from '../../actions/app';
import API from '../../api';
import i18next from 'i18next';


const ProfileModal = React.createClass({

  propTypes: {
    initial_data: React.PropTypes.object,
  },

  onSubmit() {
    this.props.dispatch(hideModal());
  },

  resetPassword(e) {
    let { dispatch, initial_data } = this.props;
    e.preventDefault();
    API.reset_password(initial_data.email)
      .then(() => {
        dispatch(showNotification(
          i18next.t(
            'They were an email sent with instructions to reset the password'
          )
        ));
      });
  },

  render() {
    let { initial_data } = this.props;
    return (
      <ProfileFormContainer
        onSubmit={this.onSubmit}
        onResetPassword={this.resetPassword}
        initial_data={initial_data}
        { ...this.props }
      />
    );
  },
});

export default ProfileModal;
