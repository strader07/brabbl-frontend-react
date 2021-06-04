import React from 'react';
import Crouton from 'react-crouton';

let UserMessage = React.createClass({

  propTypes: {
    message: React.PropTypes.string,
    closeHandler: React.PropTypes.func.isRequired,
    hidden: React.PropTypes.bool,
  },

  render() {
    let { message, closeHandler, hidden } = this.props;
    let data = {
      id: Date.now(),
      type: 'vorwaerts',
      message: message,
      onDismiss: closeHandler,
      hidden: hidden,
      timeout: 6000,
    };
    return (
      <Crouton {...data} />
    );
  },
});

export default UserMessage;

