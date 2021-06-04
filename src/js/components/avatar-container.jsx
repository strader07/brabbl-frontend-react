import React from 'react';
import Avatar from 'react-avatar';


let AvatarContainer = React.createClass({
  propTypes: {
    user: React.PropTypes.object,
  },
  render() {
    let user = this.props.user;
    let avatar_props = {
      src: user.image.small,
      name: user.display_name,
      size: 16,
      className: 'avatar',
    };
    if (user.linked.length > 0 && !user.image.small) {
      let social_props = user.linked[0];
      avatar_props[social_props[0].replace('-oauth2', '') + 'Id'] = social_props[2];
    }
    return (
      <Avatar
        {...avatar_props}
        round
      />
    );
  },
});

export default AvatarContainer;
