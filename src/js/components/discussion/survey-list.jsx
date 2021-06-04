import React from 'react';
import Statement from './statement';
import SurveyStatementWrapper from './survey-statement';
import { showModal, setSurveySorting } from '../../actions/app';
import { MODAL_STATEMENT, MSG_ORDER_BY_AVERAGE_RATING,
         MSG_ORDER_BY_DATE, BY_DATE, BY_RELEVANCE, MSG_ORDER_BY_VOTES,
         BY_VOTES, DISCUSSION_STARTED, CAN_ADD_STATEMENT,
         STATEMENT_STATUS_HIDDEN } from '../../constants';
import { DropDown, DropDownItem } from '../dropdown';
import i18next from 'i18next';
import CountdownTimer from './countdown-timer';
import BaseDetailView from '../base-detail-view';
import { UseWording, UserHasPermission } from '../../utils';


const SurveyStatement = SurveyStatementWrapper(Statement);

class SurveyList extends BaseDetailView {
  render() {
    let props = this.props;
    let createButton,
      surveyStatements;
    let { user, discussion, dispatch, app: { surveyOrder } } = props;

    if ((discussion.user_can_add_replies || UserHasPermission(user, CAN_ADD_STATEMENT))
      && this.state.discussion_status === DISCUSSION_STARTED) {
      createButton = (
        <div className="survey-button">
          <button
            className="primary full-width" ref="survey_button"
            onClick={() => {
              if (user) {
                dispatch(showModal(MODAL_STATEMENT));
              } else {
                dispatch(showModal('LOGIN'));
              }
            }}
          >
            { UseWording(props, 'survey_add_answer_button_bottom') }
          </button>
        </div>
      );
    }

    let statements = discussion.statements;
    let listHeader,
      add_new_suggestion_link;
    if (surveyOrder === BY_DATE) {
      statements.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (surveyOrder === BY_RELEVANCE) {
      if (statements.length > 0 && statements[0].barometer) {
        statements.sort((a, b) => {
          let rating_b = b.status === STATEMENT_STATUS_HIDDEN ? -4 : b.barometer.rating;
          let rating_a = a.status === STATEMENT_STATUS_HIDDEN ? -4 : a.barometer.rating;
          return rating_b - rating_a;
        });
      }
    } else if (surveyOrder === BY_VOTES) {
      statements.sort((a, b) => b.barometer.rating - a.barometer.rating).sort((a, b) => {
        let user_rating_a = a.barometer.user_rating === undefined ? -99 : a.barometer.user_rating;
        let user_rating_b = b.barometer.user_rating === undefined ? -99 : b.barometer.user_rating;
        return user_rating_b - user_rating_a;
      });
    }
    surveyStatements = statements.map(statement =>
      <SurveyStatement
        key={statement.id}
        {...props}
        statement={statement}
        discussion={discussion}
        discussion_status={this.state.discussion_status}
      />
    );
    if (this.state.discussion_status === DISCUSSION_STARTED) {
      add_new_suggestion_link = (
        <a className="add-answer" onClick={() => {
          if (user) {
            this.refs.survey_button.focus();
            dispatch(showModal(MODAL_STATEMENT));
          } else {
            dispatch(showModal('LOGIN'));
          }
        }}
        >
        <i className="fa fa-pencil"></i>
          { UseWording(props, 'survey_add_answer_button_top') }</a>);
    } else {
      add_new_suggestion_link = (<span className="add-answer not-active" onClick={this.handleDisabledDiscussion}>
        <i className="fa fa-pencil"></i> { i18next.t('Add new suggestion') }
      </span>);
    }
    if (statements.length > 0) {
      if (discussion.has_barometer) {
        listHeader = (
          <DropDown className="argument-sorting" default_children_index={0}>
            <DropDownItem onSelect={() => dispatch(setSurveySorting(BY_RELEVANCE))}>
              { i18next.t(MSG_ORDER_BY_AVERAGE_RATING) }
            </DropDownItem>
            <DropDownItem onSelect={() => dispatch(setSurveySorting(BY_DATE))} select={this}>
              { i18next.t(MSG_ORDER_BY_DATE) }
            </DropDownItem>
            <DropDownItem onSelect={() => dispatch(setSurveySorting(BY_VOTES))}>
              { i18next.t(MSG_ORDER_BY_VOTES) }
            </DropDownItem>
          </DropDown>
        );
      } else {
        listHeader = (
          <DropDown className="argument-sorting" default_children_index={0}>
            <DropDownItem onSelect={() => dispatch(setSurveySorting(BY_DATE))} select={this}>
              { i18next.t(MSG_ORDER_BY_DATE) }
            </DropDownItem>
          </DropDown>
        );
      }
    } else {
      listHeader = (
        <div className="empty-list">
          { i18next.t('No suggestions yet') + '. ' + i18next.t('Start the discussion now!') }
        </div>
      );
    }
    let statement_text = statements.length === 1 ? 'survey_statement' : 'survey_statements';
    return (
      <div>
        <div className="survey-list-header">
          <h2 className="discussion-title">{discussion.statement}</h2>
          <CountdownTimer {...this.props} />
          <h3>{statements.length} { UseWording(props, statement_text) }</h3>
          {listHeader}
          {add_new_suggestion_link}
        </div>
        <div className="discussion-body survey-body">
          {surveyStatements}
          {createButton}
        </div>
      </div>
    );
  }
}

SurveyList.propTypes = {
  user: React.PropTypes.object,
  app: React.PropTypes.object.isRequired,
  discussion: React.PropTypes.object.isRequired,
};


export default SurveyList;
