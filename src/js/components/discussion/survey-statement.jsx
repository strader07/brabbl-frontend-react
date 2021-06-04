import React from 'react';
import API from '../../api';
import { showModal, showNotification, showStatement } from '../../actions/app';
import { reloadDiscussion } from '../../actions/async';
import { Option, OptionsList } from '../options';
import {
  MODAL_STATEMENT, STATEMENT_STATUS_ACTIVE, STATEMENT_STATUS_HIDDEN,
} from '../../constants';
import i18next from 'i18next';
import { UseWording, UseNotifyWording } from '../../utils';


const SurveyStatementWrapper = (Statement) => class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: props.statement.status,
    };
    this.showStatement = this.showStatement.bind(this);
    this.hideStatement = this.hideStatement.bind(this);
    this.flagStatement = this.flagStatement.bind(this);
    this.getTitle = this.getTitle.bind(this);
  }

  static propTypes = {
    statement: React.PropTypes.object.isRequired,
  }

  showStatement(e) {
    if (e) {
      e.preventDefault();
    }
    let { dispatch, statement } = this.props;
    dispatch(showStatement(statement.id));
  }

  hideStatement() {
    let { dispatch, statement } = this.props;
    let status = this.state.status === STATEMENT_STATUS_HIDDEN ? STATEMENT_STATUS_ACTIVE : STATEMENT_STATUS_HIDDEN;
    API.change_statement_status(statement.id, status).then(() => {
      dispatch(reloadDiscussion());
    }).then(() => {
      this.setState({ 'status': status });
    });
  }

  flagStatement() {
    let { dispatch, statement } = this.props;
    API.flag({ type: 'statement', 'id': statement.id }).then(() => {
      dispatch(
        showNotification(UseNotifyWording(this.props, 'notification_report_posted'))
      );
      dispatch(reloadDiscussion());
    });
  }
  getTitle() {
    return (
      <div>
        <div className="list-item-type">{ UseWording(this.props, 'statement_header') }</div>
        <h3 className="discussion-list-item-title">
          <a onClick={this.showStatement}>
            {this.props.statement.statement}
          </a>
        </h3>
      </div>
    );
  }

  getOptionsList() {
    let { is_editable: isEditable, is_deletable: isDeletable, statement, image, video, status } = this.props.statement;
    let { dispatch } = this.props;
    let deleteOption,
      optionsList,
      flagOption;
    if (isDeletable) {
      deleteOption = (
        <Option
          icon="eye-slash"
          onClick={this.hideStatement}
        >
          { i18next.t(status === STATEMENT_STATUS_HIDDEN ? 'Show proposal' : 'Hide proposal') }
        </Option>
      );
    }
    if (status === STATEMENT_STATUS_HIDDEN) {
      flagOption = '';
    } else {
      flagOption = (
        <Option
          icon="flag-o"
          onClick={this.flagStatement}
        >
          { i18next.t('Report suggestion') }
        </Option>
      );
    }
    if (isEditable) {
      optionsList = (
        <OptionsList>
          <Option
            icon="pencil"
            onClick={() => dispatch(
              showModal(
                MODAL_STATEMENT, {
                  statement: statement,
                  image: image,
                  video: video,
                  statementId: this.props.statement.id,
                }))}
          >
            { i18next.t('Edit suggestion') }
          </Option>
          {deleteOption}
          {flagOption}
        </OptionsList>
      );
    }
    return optionsList;
  }

  render() {
    let { statement } = this.props;
    return (
      <Statement
        { ...this.props }
        statement={statement}
        barometerActive
        id={this.props.statement.id}
        title={this.getTitle()}
        handleStatementClick={this.showStatement}
        optionsList={this.getOptionsList()}
      />
    );
  }
};


export default SurveyStatementWrapper;
