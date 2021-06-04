import React from 'react';
import moment from 'moment';
import Barometer from './barometer';
import CountdownTimer from './countdown-timer';
import { ArgumentList } from '../argument';
import i18next from 'i18next';
import BaseDetailView from '../base-detail-view';
import { UseWording } from '../../utils';
import Media from '../media';
import { MEDIA_TYPE_IMAGE, MEDIA_TYPE_YOUTUBE } from '../../constants';

class Discussion extends BaseDetailView {
  render() {
    let { discussion, app } = this.props;
    let { argumentOrder, argumentLimit } = app;
    let main_statement = discussion.statements.sort((a, b) => a.id - b.id)[0];
    let default_statement = { arguments: [], created_at: '', created_by: '' };
    let statement = this.props.statement || main_statement || default_statement;
    let args = statement.arguments;
    let barometer,
      head,
      argumentList;
    let time_ago = moment(statement.created_at).fromNow();
    let title = this.props.title || discussion.statement;
    if (discussion.has_barometer) {
      barometer = statement.barometer;
      let { rating, user_rating, count, count_ratings, wording } = barometer;
      barometer = (
        <div className="barometer-container">
          <Barometer
            {...this.props}
            statement={statement}
            ratingAverage={rating}
            ratingUser={user_rating}
            ratingsTotal={count}
            wording={wording}
            countRatings={count_ratings}
            discussion_status={this.state.discussion_status}
            showStartSign={Boolean(true)}
          />
        </div>
      );
    }

    if (discussion.has_arguments) {
      argumentList = (
        <ArgumentList
          {...this.props}
          args={args}
          ordering={argumentOrder}
          limit={argumentLimit}
          statement={statement}
          discussion_status={this.state.discussion_status}
        />
      );
    }

    if (app.statementId) {
      let media_data;
      if ('video' in statement && statement.video) {
        media_data = {
          media_type: MEDIA_TYPE_YOUTUBE,
          url: statement.video,
        };
      } else if ('image' in statement && statement.image) {
        media_data = {
          media_type: MEDIA_TYPE_IMAGE,
          url: statement.image.original,
        };
      }
      head = (
        <div>
          <h5>{ UseWording(this.props, 'statement_header') }</h5>
          <h2 className="discussion-title">{title}</h2>
          <p className="discussion-meta">
            { i18next.t('by') } {statement.created_by}, {time_ago}
          </p>
          <Media data={media_data} />
        </div>
      );
    } else {
      head = <h2 className="discussion-title">{title}</h2>;
    }

    return (
      <div className="discussion-body">
        {head}
        <CountdownTimer {...this.props} />
        {barometer}
        <div className="discussion-socialsharing"></div>
        {argumentList}
      </div>
    );
  }
}
Discussion.propTypes = {
  discussion: React.PropTypes.object.isRequired,
  statement: React.PropTypes.object,
  app: React.PropTypes.object,
  title: React.PropTypes.string,
};
export default Discussion;
