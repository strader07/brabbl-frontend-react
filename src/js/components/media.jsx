import React from 'react';
import YouTube from 'react-youtube';
import { MEDIA_TYPE_IMAGE, MEDIA_TYPE_YOUTUBE } from '../constants';

let Media = React.createClass({

  propTypes: {
    data: React.PropTypes.object.isRequired,
  },

  render() {
    let { url, media_type } = this.props.data;
    let media;
    if (media_type === MEDIA_TYPE_IMAGE) {
      media = (<img src={ url } />);
    } else if (media_type === MEDIA_TYPE_YOUTUBE) {
      media = (<div className="video-container"><YouTube videoId={ url } /></div>);
    }
    return (
        <div className="media">
          { media }
        </div>
    );
  },
});

export default Media;
