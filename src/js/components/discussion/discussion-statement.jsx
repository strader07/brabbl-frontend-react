import React from 'react';
import { showSurvey } from '../../actions/app';
import Discussion from './discussion';


const StatementDiscussion = React.createClass({

  propTypes: {
    discussion: React.PropTypes.object.isRequired,
    statementId: React.PropTypes.number,
  },

  getStatement(statementId) {
    return this.props.discussion.statements.filter(stat => stat.id === statementId)[0];
  },

  showSurvey(e) {
    e.preventDefault();
    this.props.dispatch(showSurvey());
  },

  render() {
    let { discussion, statementId } = this.props;
    let statement = this.getStatement(statementId);
    return (
      <div>
        <div className="back-link" onClick={this.showSurvey}>
          <i className="fa fa-long-arrow-left"></i>
          <span>{discussion.statement}</span>
        </div>
        <Discussion
          {...this.props}
          statement={statement}
          title={statement.statement}
        />
      </div>
    );
  },
});

export default StatementDiscussion;
