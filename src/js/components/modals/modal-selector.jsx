import React from 'react';
import LoginModal from './login';
import SignupModal from './signup';
import PasswordResetModal from './password';
import DiscussionModal from './discussion';
import DiscussionListModal from './discussion_list';
import ArgumentModal from './argument';
import StatementModal from './statement';
import ProfileModal from './profile';
import MediaModal from './media';
import IFrameModal from './iframe';
import BarometerModal from './barometer';
import DataPolicyModal from './data_policy';
import DeleteModal from './delete_discussion';
import { MODAL_LOGIN, MODAL_SIGNUP, MODAL_DISCUSSION, MODAL_DISCUSSION_LIST,
  MODAL_PASSWORD, MODAL_ARGUMENT_PRO, MODAL_ARGUMENT_CONTRA,
  MODAL_ARGUMENT_EDIT, MODAL_STATEMENT, MODAL_PROFILE, MODAL_MEDIA,
  MODAL_IFRAME, MODAL_BAROMETER, MODAL_DATAPOLICY, MODAL_DELETE_DISCUSSION } from '../../constants';

let ModalSelector = React.createClass({

  propTypes: {
    modal: React.PropTypes.object,
    dispatch: React.PropTypes.func,
  },

  render() {
    let { modal } = this.props;
    switch (modal.modal) {
      case MODAL_DELETE_DISCUSSION:
        return <DeleteModal {...this.props} />;
      case MODAL_LOGIN:
        return <LoginModal {...this.props} />;
      case MODAL_SIGNUP:
        return <SignupModal {...this.props} />;
      case MODAL_DATAPOLICY:
        return <DataPolicyModal {...this.props} />;
      case MODAL_PROFILE:
        return (
          <ProfileModal
            initial_data={modal.data}
            {...this.props}
          />
        );
      case MODAL_BAROMETER:
        return <BarometerModal {...this.props} />;
      case MODAL_STATEMENT:
        return (
          <StatementModal
            initial_data={modal.data}
            {...this.props}
          />
        );
      case MODAL_DISCUSSION:
        return (
          <DiscussionModal
            {...this.props}
            discussion={modal.data.discussion}
          />
        );
      case MODAL_DISCUSSION_LIST:
        return (
          <DiscussionListModal
            {...this.props}
          />
        );
      case MODAL_PASSWORD:
        return <PasswordResetModal {...this.props} />;
      case MODAL_ARGUMENT_PRO:
      case MODAL_ARGUMENT_CONTRA:
      case MODAL_ARGUMENT_EDIT:
        return (
          <ArgumentModal
            data={modal.data}
            is_pro={modal.modal === MODAL_ARGUMENT_PRO}
            edit={modal.modal === MODAL_ARGUMENT_EDIT}
            {...this.props}
          />
        );
      case MODAL_MEDIA:
        return (
          <MediaModal
            data={modal.data}
            {...this.props}
          />
        );
      case MODAL_IFRAME:
        return (
          <IFrameModal
            data={modal.data}
            {...this.props}
          />
        );
      default:
        return null;
    }
  },
});

export default ModalSelector;
