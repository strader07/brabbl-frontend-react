import i18next from 'i18next';
import React from 'react';
import { bootstrapApp } from '../actions/async';
import { showNotification, showModal } from '../actions/app';
import { DropDown, DropDownItem } from './dropdown';
import API from '../api';
import { MODAL_LOGIN, MODAL_PROFILE, MODAL_DISCUSSION, MODAL_DISCUSSION_LIST, MODAL_IFRAME,
CAN_CHANGE_DISCUSSION, CAN_CHANGE_DISCUSSION_LIST, CAN_CHANGE_USER, IFRAME_USERLIST } from '../constants';
import { UseNotifyWording, UserHasPermission } from '../utils';
import AvatarContainer from './avatar-container';

let UserLogin = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    currentView: React.PropTypes.string,
  },

  onLogoutClick() {
    API.logout();
    this.props.dispatch(bootstrapApp());
    this.props.dispatch(
      showNotification(UseNotifyWording(this.props, 'notification_logout'))
    );
  },

  render() {
    let cssClass = 'discussion-header-login';
    let { user, dispatch } = this.props;
    let loginItem,
      profileItem,
      editDiscussionItem,
      userListItem,
      loginOrProfile,
      avatar;

    if (user) {
      loginItem = (
        <DropDownItem onSelect={() => dispatch(showModal(MODAL_PROFILE, { ...user }))}>
          { i18next.t('Profile') }
        </DropDownItem>
      );
      profileItem = (
        <DropDownItem onSelect={this.onLogoutClick}>
          { i18next.t('Logout') }
        </DropDownItem>
      );
      if (UserHasPermission(user, CAN_CHANGE_DISCUSSION_LIST) && this.props.currentView === 'list') {
        editDiscussionItem = (
          <DropDownItem onSelect={() => dispatch(showModal(MODAL_DISCUSSION_LIST, { ...this.props }))}>
            { i18next.t('Edit List') }
          </DropDownItem>
        );
      }
      if (UserHasPermission(user, CAN_CHANGE_DISCUSSION) && this.props.currentView !== 'list') {
        editDiscussionItem = (
          <DropDownItem onSelect={() => dispatch(showModal(MODAL_DISCUSSION, { ...this.props }))}>
            { i18next.t('Edit discussion') }
          </DropDownItem>
        );
      }
      if (UserHasPermission(user, CAN_CHANGE_USER)) {
        userListItem = (
          <DropDownItem
            onSelect={() => dispatch(showModal(MODAL_IFRAME, { iframe_type: IFRAME_USERLIST, ...this.props }))}
          >
            { i18next.t('User list') }
          </DropDownItem>
        );
      }
      avatar = (<AvatarContainer user={user} />);
      loginOrProfile = (
        <DropDown className={cssClass} fixedActiveItem={avatar}>
          {loginItem}
          {profileItem}
          {editDiscussionItem}
          {userListItem}
        </DropDown>
      );
    } else {
      loginOrProfile = (
        <div className="dropdown-select discussion-header-login">
          <a className="dropdown-active" onClick={() => dispatch(showModal(MODAL_LOGIN))}>
            <span className="login-link">{ i18next.t('Login') }</span>
          </a>
        </div>
      );
    }
    return loginOrProfile;
  },
});

export default UserLogin;
