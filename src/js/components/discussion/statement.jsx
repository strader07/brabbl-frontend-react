import React from 'react';
import moment from 'moment';
import Barometer from './barometer';
import LazyLoad from 'react-lazy-load';
import { UseWording } from '../../utils';
import {
  MODAL_MEDIA, MEDIA_TYPE_IMAGE, MEDIA_TYPE_YOUTUBE, STATEMENT_STATUS_HIDDEN,
} from '../../constants';
import DiscussionTimeLeft from './discussion-time-left';
import { showModal } from '../../actions/app';
import MarkupWording from '../markup_wording';


let Statement = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    optionsList: React.PropTypes.object.isRequired,
    title: React.PropTypes.object.isRequired,
    discussion_status: React.PropTypes.string.isRequired,
    id: React.PropTypes.string.isRequired,
    customer: React.PropTypes.object.isRequired,
    statement: React.PropTypes.object.isRequired,
    handleStatementClick: React.PropTypes.func.isRequired,
    barometerActive: React.PropTypes.bool,
    status: React.PropTypes.string.isRequired,
  },

  getStatementMediaThumb() {
    let { dispatch, statement } = this.props;
    if ('thumbnail' in statement && statement.thumbnail) {
      if (statement.status === STATEMENT_STATUS_HIDDEN) {
        return;
      }
      let media_type,
        video_icon,
        url;
      if ('video' in statement && statement.video) {
        media_type = MEDIA_TYPE_YOUTUBE;
        url = statement.video;
        video_icon = (<i className="fa fa-play-circle-o"></i>);
      } else if ('image' in statement && statement.image) {
        media_type = MEDIA_TYPE_IMAGE;
        url = statement.image.original;
      }
      let class_name = 'modal-media-button media-' + media_type;
      return (<div className="discussion-list-item-thumbnail">
        <a className={class_name}
          onClick={
            () => dispatch(showModal(MODAL_MEDIA, {
              thumbnail: statement.thumbnail,
              url: url,
              media_type: media_type,
            }))}
        >
          <LazyLoad>
            <img width="100" height="70" src={statement.thumbnail} />
          </LazyLoad>
          {video_icon}
        </a>
      </div>);
    }
    return;
  },

  render() {
    let { barometer, created_at, image_url, url, statement_count, status } = this.props.statement;
    let { barometerActive, optionsList, title, handleStatementClick } = this.props;
    let timeAgo = status === STATEMENT_STATUS_HIDDEN ? '' : moment(created_at).fromNow();
    let discussionImage,
      counter_statement;
    let statement_text = statement_count === 1 ? 'survey_statement' : 'survey_statements';

    if (barometer) {
      let { rating, user_rating, count, wording } = barometer;
      let className = 'discussion-list-item-barometer';

      if (status === STATEMENT_STATUS_HIDDEN) {
        barometerActive = false;
        counter_statement = '';
        title = (
          <div className="hidden-text-body non-active">
            <h4><MarkupWording {...this.props} wording="hidden_argument_title" /></h4>
            <div><MarkupWording {...this.props} wording="hidden_argument_text" /></div>
          </div>
        );
      } else {
        counter_statement = (
          <div className="discussion-list-item-num-arguments">
            {statement_count} { UseWording(this.props, statement_text) }
          </div>
        );
      }

      if (!barometerActive) {
        className += ' no-handle';
        barometer = '';
      } else {
        if (!this.props.discussion_status) {
          className += ' no-handle';
        }
        barometer = (
          <div className={className}>
            <Barometer
              {...this.props}
              disabled={!barometerActive}
              ratingAverage={rating}
              ratingUser={user_rating}
              ratingsTotal={count}
              wording={wording}
              discussion_status={this.props.discussion_status}
            />
          </div>
        );
      }
    } else {
      if (statement_count) {
        counter_statement = (
          <div className="discussion-list-item-num-arguments">
            {statement_count} { UseWording(this.props, statement_text) }
          </div>
        );
      }
    }
    if (image_url) {
      discussionImage = (
        <a href={url + '#brabbl-widget'} className="discussion-list-item-image-link">
          <img role="presentation" className="discussion-list-item-image" src={image_url} />
        </a>
      );
    }
    const handleClick = (e) => {
      if (status === STATEMENT_STATUS_HIDDEN) {
        return;
      }
      if (e.target.className.indexOf('discussion-list-item') > -1) {
        handleStatementClick();
      }
    };
    let discussion_timeleft;
    if (!('articleId' in this.props)) {
      discussion_timeleft = <DiscussionTimeLeft discussion={this.props.statement} />;
    }
    return (
      <div
        id={'statement-' + this.props.id}
        onClick={(e) => handleClick(e)}
        className={
          'discussion-list-item'
          + (discussionImage ? ' has-image' : '')
          + (barometer ? ' has-barometer' : '')
          + (optionsList ? ' has-options' : '')
        }
      >
        {discussionImage}
        {optionsList}
        <div className="discussion-list-item-content">
          <p className="discussion-list-item-tags"></p>
          {this.getStatementMediaThumb()}
          {title}
          {discussion_timeleft}
          <div className="discussion-list-item-date">{timeAgo}</div>
        </div>
        <div className="discussion-list-item-footer">
          {barometer || counter_statement}
        </div>
      </div>
    );
  },
});

export default Statement;
