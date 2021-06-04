import React from 'react';
import moment from 'moment';
import { showNotification, showModal } from '../../actions/app';
import { reloadDiscussion, fetchArgument } from '../../actions/async';
import StarRating from './starrating';
import { OptionsList, Option } from '../options';
import API from '../../api';
import {
  MODAL_ARGUMENT_EDIT, DISCUSSION_STARTED, ARGUMET_STATUS_ACTIVE, ARGUMET_STATUS_HIDDEN, CAN_CHANGE_ARGUMENT,
} from '../../constants';
import i18next from 'i18next';
import { UseWording, UseNotifyWording, UserHasPermission } from '../../utils';
import MarkupWording from '../markup_wording';


const Argument = React.createClass({

  propTypes: {
    arg: React.PropTypes.object,
    statement: React.PropTypes.object.isRequired,
    discussion: React.PropTypes.object.isRequired,
    user: React.PropTypes.object,
    initial_data: React.PropTypes.object,
    discussion_status: React.PropTypes.string.isRequired,
  },

  getInitialState() {
    return {
      rating: this.props.arg.rating.rating,
      ratingUser: this.props.arg.status === ARGUMET_STATUS_ACTIVE ? this.props.arg.rating.user_rating : 0,
      ratingCount: this.props.arg.rating.count,
      status: this.props.arg.status,
    };
  },

  rateArgument(e, rating) {
    API.rate_argument(this.props.arg.id, rating.userRating).then((resp) => {
      this.setState({
        'rating': resp.data.rating,
        'ratingUser': resp.data.user_rating,
        'ratingCount': resp.data.count,
      });
    });
  },

  editArgument() {
    let { dispatch, arg, statement } = this.props;
    dispatch(showModal(MODAL_ARGUMENT_EDIT, {
      initial: arg,
      statement: statement,
    })
    );
  },

  deleteArgument() {
    let { dispatch, arg } = this.props;
    API.delete_argument(arg.id).then(() => {
      dispatch(reloadDiscussion());
      if (arg.reply_to) {
        dispatch(fetchArgument(arg.reply_to));
      }
    });
  },

  hideArgument() {
    let { dispatch, arg } = this.props;
    let status = this.state.status === ARGUMET_STATUS_ACTIVE ? ARGUMET_STATUS_HIDDEN : ARGUMET_STATUS_ACTIVE;
    API.change_argument_status(arg.id, status).then(() => {
      dispatch(reloadDiscussion());
    }).then(() => {
      this.setState({
        'status': status,
      });
    });
  },

  flagArgument() {
    API.flag({ type: 'argument', 'id': this.props.arg.id }).then(() => {
      this.props.dispatch(
        showNotification(UseNotifyWording(this.props, 'notification_report_posted'))
      );
      this.props.dispatch(reloadDiscussion());
    });
  },

  discussArgument(e) {
    e.preventDefault();
    let { dispatch, arg } = this.props;
    dispatch(fetchArgument(arg.id));
  },

  render() {
    let { user, arg, discussion } = this.props;
    let { title, is_pro, text, created_by, created_at, rating,
      is_editable: isEditable, is_deletable: isDeletable } = arg;
    let titleTitle,
      textTitle,
      userRating,
      optionsList,
      reportOption,
      editOption,
      deleteOption,
      hideOption,
      hideOptionLabel,
      replies,
      argument_footer;
    let argType = (is_pro === true) ? 'pro' : 'contra';
    let cssClass = 'argument argument-' + argType;
    let time_ago = moment(created_at).fromNow();
    let editing = user !== null && this.props.discussion_status === DISCUSSION_STARTED;
    let argTypeWording = UseWording(this.props, 'header_pro');

    if (!is_pro) {
      argTypeWording = UseWording(this.props, 'header_contra');
    }

    rating = this.state.rating;
    if (this.state.ratingUser > 0 || rating.user_rating > 0) {
      userRating = this.state.ratingUser || rating.user_rating;
    } else {
      userRating = null;
    }

    if (this.state.status === ARGUMET_STATUS_HIDDEN) {
      if (UserHasPermission(user, CAN_CHANGE_ARGUMENT)) {
        titleTitle = title;
        textTitle = text;
      }
      title = (<MarkupWording {...this.props} wording="hidden_argument_title" />);
      text = (<MarkupWording {...this.props} wording="hidden_argument_text" />);
      cssClass = cssClass + ' non-active';
    }
    if (user) {
      if (isEditable) {
        editOption = (
          <Option icon="pencil" onClick={this.editArgument}>
            { i18next.t('Edit argument') }
          </Option>
        );
      }
      if (isDeletable) {
        deleteOption = (
          <Option icon="minus-circle" onClick={this.deleteArgument}>
            { i18next.t('Delete argument') }
          </Option>
        );
      }
      if (this.state.status !== ARGUMET_STATUS_HIDDEN) {
        reportOption = (
          <Option icon="flag-o" onClick={this.flagArgument}>
            { i18next.t('Report argument') }
          </Option>
        );
      }
      if (UserHasPermission(user, CAN_CHANGE_ARGUMENT)) {
        hideOptionLabel = this.state.status === ARGUMET_STATUS_ACTIVE ? 'Hide argument' : 'Show argument';
        hideOption = (
          <Option icon="eye-slash" onClick={this.hideArgument}>
            { i18next.t(hideOptionLabel) }
          </Option>
        );
      }
      optionsList = (
        <div>
          <OptionsList>
            {reportOption}
            {editOption}
            {hideOption}
            {deleteOption}
          </OptionsList>
        </div>
      );
    }
    if (!arg.reply_to && this.state.status === ARGUMET_STATUS_ACTIVE && discussion.has_replies) {
      let answer_text = arg.reply_count === 1 ? 'reply_counter' : 'reply_counter_plural';
      replies = (
        <div className="argument-replies">
          <a onClick={this.discussArgument}>
            <span className="reply-count">{arg.reply_count}</span>
            <i className="fa fa-reply"></i>
            <p>{ UseWording(this.props, answer_text) }</p>
          </a>
        </div>
      );
    }
    if (this.state.status === ARGUMET_STATUS_ACTIVE) {
      argument_footer = (
        <div className="argument-footer">
          <div className="argument-vote-stat">
            <span className="star">&#9734;</span>{this.state.rating}<br />
            <small>({this.state.ratingCount})</small>
          </div>
          <StarRating
            name="rating"
            size="sm"
            user={user}
            editing={editing}
            disabled={this.state.status === ARGUMET_STATUS_HIDDEN}
            rating={rating}
            userRating={userRating}
            onRatingClick={this.rateArgument}
            dispatch={this.props.dispatch}
            {...this.props}
          />
          {replies}
        </div>
      );
    } else {
      argument_footer = '';
    }
    return (
      <div className={cssClass}>
        <div className="argument-header">
          <div className="argument-type">{argTypeWording}</div>
          {optionsList}
        </div>
        <div className="argument-body">
          <h4 title={titleTitle}>{title}</h4>
          <p title={textTitle}>{text}</p>
          <div className="argument-meta">{created_by}, {time_ago}</div>
        </div>
        {argument_footer}
      </div>
    );
  },
});

export default Argument;
