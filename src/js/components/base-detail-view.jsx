import { DISCUSSION_HAS_NOT_STARTED, DISCUSSION_STARTED, DISCUSSION_COMPLETED } from '../constants';
import { showNotification } from '../actions/app';
import React from 'react';
import moment from 'moment';


const BaseDetailView = React.createClass({
  propTypes: {
    discussion: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    let { discussion_status } = this.getDiscussionStatus();
    return {
      discussion_status: discussion_status,
    };
  },
  componentDidMount() {
    this.startPolling();
  },

  componentWillUnmount() {
    if (this._timer) {
      clearInterval(this._timer);
      this._timer = null;
    }
  },

  getDiscussionStatus() {
    let current_date = moment().toJSON();
    let { start_time, end_time } = this.props.discussion;
    let discussion_status,
      interval;
    if (end_time <= current_date) {
      discussion_status = DISCUSSION_COMPLETED;
      interval = 0;
    } else if (start_time >= current_date) {
      discussion_status = DISCUSSION_HAS_NOT_STARTED;
      interval = moment.utc(start_time).diff(moment.utc(current_date));
    } else if ((current_date > start_time || !start_time) && (current_date <= end_time || !end_time)) {
      discussion_status = DISCUSSION_STARTED;
      interval = moment.utc(end_time).diff(moment.utc(current_date));
    }
    // update view if status will changed in less than 6 hours
    if (!this._timer && interval > 0 && interval < 21600000) {
      this._timer = setInterval(this.poll, interval + 1000);
    }
    return { discussion_status, interval };
  },

  handleDisabledDiscussion() {
    let { dispatch } = this.props;
    let { discussion_status } = this.getDiscussionStatus();
    let notification;
    if (discussion_status === DISCUSSION_COMPLETED) {
      notification = 'Discussion already completed.';
    } else if (discussion_status === DISCUSSION_HAS_NOT_STARTED) {
      notification = 'Discussion has not started yet';
    }
    dispatch(showNotification(notification));
  },

  poll() {
    let { discussion_status, interval } = this.getDiscussionStatus();
    if (this.state.discussion_status !== discussion_status) {
      clearInterval(this._timer);
      if (interval > 0) {
        this._timer = setInterval(this.poll, interval);
      }
      this.setState({
        discussion_status: discussion_status,
      });
    }
  },

  startPolling() {
    let self = this;
    setTimeout(() => {
      if (!self.isMounted()) {
        return;
      } // abandon
      self.poll(); // do it once and then start it up ...
    }, 1000);
  },
  render() { },
});

export default BaseDetailView;
