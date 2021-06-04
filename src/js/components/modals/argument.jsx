import React from 'react';
import { ArgumentFormContainer } from '../forms';
import { showNotification } from '../../actions/app';
import { reloadDiscussion, fetchArgument } from '../../actions/async';
import { UseNotifyWording } from '../../utils';

let ArgumentModal = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    data: React.PropTypes.object,
    is_pro: React.PropTypes.bool.isRequired,
    edit: React.PropTypes.bool,
  },

  onArgumentSubmit() {
    let { dispatch } = this.props;
    if (this.props.edit) {
      dispatch(showNotification(UseNotifyWording(this.props, 'notification_message_updated')));
    } else {
      dispatch(showNotification(UseNotifyWording(this.props, 'notification_message_posted')));
    }
    if (this.props.data.argument) {
      dispatch(reloadDiscussion());
      dispatch(fetchArgument(this.props.data.argument.id));
    } else {
      dispatch(reloadDiscussion());
    }
  },

  render() {
    let { is_pro, user, edit, data } = this.props;
    let { initial, title, argument, statement } = data;
    let initial_data;
    if (edit) {
      initial_data = initial;
    }
    return (
      <div>
        <ArgumentFormContainer
          is_pro={is_pro}
          statement={statement}
          argument={argument}
          title={title}
          username={user.username}
          initial_data={initial_data}
          onSubmit={this.onArgumentSubmit}
          {...this.props}
        />
      </div>
    );
  },
});

export default ArgumentModal;
