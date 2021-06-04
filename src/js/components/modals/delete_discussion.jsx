import React from 'react';
import { hideModal } from '../../actions/app';
import API from '../../api';
import i18next from 'i18next';

let DeleteModal = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    discussion: React.PropTypes.object,
  },

  onDelete(e) {
    e.preventDefault();
    let { discussion } = this.props;
    API.delete_discussion(discussion.external_id);
    this.props.dispatch(hideModal());
    document.location.reload(true);
  },

  onCancel(e) {
    e.preventDefault();
    this.props.dispatch(hideModal());
  },

  render() {
    return (
      <div>
        <p>{ i18next.t('Really delete this discussion? (This cannot be undone!)') }</p>
        <button onClick={this.onDelete}>{ i18next.t('Delete discussion') }</button>
        <button onClick={this.onCancel}>{ i18next.t('cancel') }</button>
      </div>
    );
  },
});

export default DeleteModal;
