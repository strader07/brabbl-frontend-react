import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactSlider from 'react-slider';
import { showModal, showNotification } from '../../actions/app';
import { reloadDiscussion } from '../../actions/async';
import {
  DISCUSSION_STARTED, DISCUSSION_COMPLETED, DISCUSSION_HAS_NOT_STARTED,
} from '../../constants';
import API from '../../api';
import i18next from 'i18next';
import MarkupWording from '../markup_wording';

const Barometer = React.createClass({

  propTypes: {
    user: React.PropTypes.object,
    sliderMinMax: React.PropTypes.number,
    disabled: React.PropTypes.bool,
    statement: React.PropTypes.object,
    wording: React.PropTypes.array,
    ratingAverage: React.PropTypes.number.isRequired,
    ratingsTotal: React.PropTypes.number.isRequired,
    discussion_status: React.PropTypes.string.isRequired,
    ratingUser: React.PropTypes.number,
    showStartSign: React.PropTypes.bool,
    countRatings: React.PropTypes.object,
  },

  getDefaultProps() {
    return {
      sliderMinMax: 3,
    };
  },

  getInitialState() {
    return {
      cache: {
        ratingUser: this.props.ratingUser,
        ratingAverage: this.props.ratingAverage,
        ratingsTotal: this.props.ratingsTotal,
        countRatings: this.props.countRatings || this.props.statement.barometer.count_ratings,
      },
      wordingDict: this.buildWordingDict(this.props.wording),
      visibleTooltip: null,
      ratingUser: this.props.ratingUser,
      ratingAverage: this.props.ratingAverage,
      ratingsTotal: this.props.ratingsTotal,
      countRatings: this.props.countRatings || this.props.statement.barometer.count_ratings,
    };
  },

  componentDidMount() {
    this.slideContainer = findDOMNode(this.refs.sliderContainer);
    this.slideContainer.addEventListener('mousemove', this.onBarometerHover);
    this.slideContainer.addEventListener('mouseleave', this.onBarometerLeave);
  },

  // TODO update cache if necessary
  shouldComponentUpdate(nextProps) {
    if (nextProps !== this.props) {
      this.state.cache.ratingUser = nextProps.ratingAverage;
      this.state.cache.ratingAverage = nextProps.ratingAverage;
      this.state.cache.ratingsTotal = nextProps.ratingsTotal;
      this.state.cache.countRatings = nextProps.countRatings || nextProps.statement.barometer.count_ratings;
      this.setState({
        cache: this.state.cache,
        ratingUser: nextProps.ratingUser,
        ratingAverage: nextProps.ratingAverage,
        ratingsTotal: nextProps.ratingsTotal,
        countRatings: nextProps.countRatings || nextProps.statement.barometer.count_ratings,
        statementTitle: nextProps.statement && nextProps.statement.statement,
      });
      return true;
    } else {
      // TODO test next state against cache
      return true;
    }
  },

  componentWillUnmount() {
    this.slideContainer.removeEventListener('hover', this.onBarometerHover);
    // this.slideContainer.removeEventListener('mouseleave', this.onBarometerLeave);
    this.slideContainer.removeEventListener('mouseenter', this.onBarometerEnter);
    this.slideContainer.removeEventListener('mousedown', this.onBarometerDown);
  },

  onBarometerHover(e) {
    e.stopPropagation();
    if (e.target.className === 'barometer-slider') {
      let sliderWidth = e.target.offsetWidth;
      let mousePos = e.pageX - e.target.getBoundingClientRect().left;
      let currentPercentage = Math.round(100 / sliderWidth * mousePos);
      let chunkSize = 100 / (this.props.sliderMinMax * 2);
      let step = Math.round((currentPercentage) / chunkSize) + 1;
      this.setState({ visibleTooltip: step });
    }
  },

  onBarometerEnter(e) {
    e.stopPropagation();
    if (e.target.className === 'barometer-slider') {
      let sliderWidth = e.target.offsetWidth;
      let mousePos = e.pageX - e.target.getBoundingClientRect().left;
      let currentPercentage = Math.round(100 / sliderWidth * mousePos);
      let chunkSize = 100 / (this.props.sliderMinMax * 2);
      let step = Math.round((currentPercentage) / chunkSize) + 1;
      this.setState({ visibleTooltip: step });
    }
  },

  onBarometerDown(e) {
    e.stopPropagation();
    setTimeout(this.setVisibleTooltip, 3000);
  },

  onBarometerLeave(e) {
    e.stopPropagation();
    setTimeout(this.setVisibleTooltip, 3000);
  },

  setVisibleTooltip() {
    this.setState({ visibleTooltip: null });
  },

  buildWordingDict(wording) {
    let wordingDict = {};
    if (wording) {
      for (let i = 0; i < wording.length; ++i) {
        if (typeof wording[i] !== 'undefined') {
          wordingDict[wording[i].value] = wording[i].name;
        }
      }
    }
    return wordingDict;
  },

  handleChange(val) {
    let ratingAverage,
      mean = this.state.cache.ratingAverage,
      count = this.state.cache.ratingsTotal;

    this.setState({ visibleTooltip: val + 4 });
    if (this.props.user !== null && this.state.cache.ratingUser !== null &&
          typeof this.state.cache.ratingUser !== 'undefined') {
      // reverse last user rating
      /*
      let last_val = this.state.cache.ratingUser;
      mean = (mean - (last_val / count)) / (1 - (1 / count));
      count -= 1;
      */
      ratingAverage = mean;
    } else {
      ratingAverage = mean + ((1 / (count + 1)) * (val - mean));
      count += 1;
    }

    this.setState({
      ratingUser: val,
      ratingAverage: ratingAverage,
      ratingsTotal: count,
    });
  },

  handleAfterChange(val) {
    let { dispatch, user } = this.props;
    this.setState({ visibleTooltip: val + 4 });
    if (!user) {
      dispatch(showModal('LOGIN'));
      // reset
      this.setState({
        // has not rated yet
        ratingUser: null,
        ratingAverage: this.state.cache.ratingAverage,
        ratingsTotal: this.state.cache.ratingsTotal,
      });
      return;
    }

    // TODO: create a more granular RATE_BAROMETER action
    API.vote_statement(this.props.statement.id, val).then((resp) => {
      let data = resp.data;
      // update cache
      this.state.cache.ratingUser = this.state.ratingAverage;
      this.state.cache.ratingAverage = this.state.ratingAverage;
      this.state.cache.ratingsTotal = this.state.ratingsTotal;
      this.state.cache.countRatings = data.count_ratings;
      this.setState({
        cache: this.state.cache,
        countRatings: data.count_ratings,
      });
      return this.props.dispatch(reloadDiscussion());
    });
  },

  handleClick(e) {
    e.stopPropagation();
    this.props.dispatch(showModal('BAROMETER', this.state));
  },

  handleDisabledDiscussion() {
    let { dispatch, discussion_status } = this.props;
    let notification;
    if (discussion_status === DISCUSSION_COMPLETED) {
      notification = 'Discussion already completed.';
    } else if (discussion_status === DISCUSSION_HAS_NOT_STARTED) {
      notification = 'Discussion has not started yet';
    }
    dispatch(showNotification(notification));
  },

  renderSeperators() {
    let numSteps = this.props.sliderMinMax * 2;
    let seperators = [];
    for (let i = 1; i < numSteps; i++) {
      let style = {
        left: 100 / numSteps * i + '%',
      };
      seperators.push(
        <span key={i} className="barometer-seperator" style={style}></span>
      );
    }
    return seperators;
  },

  renderSliderMask() {
    let { sliderMinMax } = this.props;
    let { ratingAverage } = this.state;
    let width = 50 - (50 / sliderMinMax * Math.abs(ratingAverage));
    let colorClass = 'pos';
    let style = {
      width: width + '%',
    };
    if (ratingAverage < 0) {
      colorClass = 'neg';
    }
    return (
      <div>
        <div className={'barometer-slider-mask-1 ' + colorClass} style={style}></div>
        <div className={'barometer-slider-mask-2 ' + colorClass}></div>
      </div>
    );
  },

  renderTooltips() {
    if (!this.props.user) {
      return null;
    }
    let text;
    let numSteps = this.props.sliderMinMax * 2;
    let tooltips = [];
    for (let i = 0; i <= numSteps; i++) {
      let hintStyle = {
        left: 100 / numSteps * i + '%',
        display: (this.state.visibleTooltip === i + 1) ? 'inline-block' : 'none',
      };

      text = this.state.wordingDict[i - this.props.sliderMinMax] || '';
      if (text) {
        tooltips.push(
          <div className="barometer-hint-container" style={hintStyle}>
            <div className="barometer-hint">{text}</div>
          </div>
        );
      }
    }
    return tooltips;
  },

  render() {
    let { ratingsTotal, ratingUser, ratingAverage } = this.state;
    let ratingText = ratingUser;
    let is_disabled = this.props.disabled || this.props.discussion_status !== DISCUSSION_STARTED;
    let showStartSign = false;
    let slider_container_class = is_disabled ? 'barometer-slider-container not-active' : 'barometer-slider-container';
    // only 1 decimals
    ratingAverage = Math.round(ratingAverage * 10) / 10;

    // determine handle text
    if (ratingText > 0) {
      ratingText = '+' + ratingText;
    } else if (typeof ratingText === 'undefined' || ratingText === null) {
      ratingText = '?';
      showStartSign = this.props.showStartSign;
      // reset position
      ratingUser = 0;
    }

    return (
      <div className="barometer" onClick={this.handleDisabledDiscussion}>
        <div className="barometer-rating-total">
          <span className="barometer-label">{i18next.t('Total')}</span>
          <span className="barometer-number">
            <span className={ratingAverage > 0 ? 'color-pos' : 'color-neg'}>
              {ratingAverage > 0 ? '+' : ''}{ratingAverage}
            </span>
            <span
              className="barometer-number-symbol-avg"
              title={i18next.t('Average opinion')}
            >
              ∅
            </span>
          </span>
        </div>
        <div className={slider_container_class} ref="sliderContainer">
          <ReactSlider
            className="barometer-slider"
            disabled={is_disabled}
            value={ratingUser}
            min={-this.props.sliderMinMax}
            max={this.props.sliderMinMax}
            onAfterChange={this.handleAfterChange}
            onChange={this.handleChange}
            withBars
          >
            <div className="handle">
              <span className="handle-text">{ratingText}</span>
            </div>
          </ReactSlider>
          <div className="barometer-zero-mark"></div>
          {this.renderSeperators()}
          {this.renderTooltips()}
          {this.renderSliderMask()}
        </div>
        <div className="barometer-num-votes">
          <a onClick={this.handleClick}>
            <span className="barometer-label">
              { i18next.t('Votes') }
            </span>
            <span className="barometer-number">
              {ratingsTotal} <i title={ratingsTotal + ' Stimmen'} className="fa fa-user"></i>
            </span>
          </a>
        </div>
        <div className={'barometer-start-sign' + (showStartSign ? ' show' : '')}>
          <MarkupWording {...this.props} wording="barometer_start_sign" />
        </div>
      </div>
    );
  },
});

export default Barometer;
