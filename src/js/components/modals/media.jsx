import React from 'react';
import { hideModal } from '../../actions/app';
import Media from '../../components/media';

let MediaModal = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  onCancel(e) {
    e.preventDefault();
    this.props.dispatch(hideModal());
  },
  render() {
    return (
      <div className="media-modal">
        <div className="modal-media-body">
          <Media data={this.props.data} />
        </div>
      </div>
    );
  },
});

export default MediaModal;
