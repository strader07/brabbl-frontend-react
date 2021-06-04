import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { ArgumentList } from '../argument';
import { showStatement } from '../../actions/app';
import i18next from 'i18next';


const ArgumentDiscussion = React.createClass({

  propTypes: {
    discussion: React.PropTypes.object.isRequired,
    argument: React.PropTypes.object,
    app: React.PropTypes.object,
    statementId: React.PropTypes.number,
    argumentId: React.PropTypes.number,
  },

  getStatement(statementId) {
    return this.props.discussion.statements.filter(stat => stat.id === statementId)[0];
  },

  showStatement() {
    this.props.dispatch(showStatement(this.props.statementId));
  },

  render() {
    let { discussion, argument, app } = this.props;
    let statement = this.getStatement(argument.statement_id);
    let { argumentOrder, argumentLimit } = app;
    let time_ago = moment(argument.created_at).fromNow();
    let argType = argument.is_pro ? 'Pro' : 'Contra';
    return (
      <div>
        <div className="back-link" onClick={this.showStatement}>
          <i className="fa fa-long-arrow-left"></i>
          <span>{statement.statement || discussion.statement}</span>
        </div>
        <div className="discussion-body">
          <div className="discussion-meta-header">
            <div className="argument-type">
              { i18next.t(argType + '-Argument') }
            </div>
            <h2 className="argument-title">{argument.title}</h2>
            <p>{argument.text}</p>
            <span>
              { i18next.t('by') } {argument.created_by}, {time_ago}
            </span>
          </div>
          <div className="discussion-socialsharing"></div>
          <ArgumentList
            {...this.props}
            args={argument.replies}
            statement={statement}
            argument={argument}
            ordering={argumentOrder}
            limit={argumentLimit}
          />
        </div>
      </div>
    );
  },
});

const mapStateToProps = (state) => ({
  argument: state.argument,
  discussion: state.discussion,
});

export default connect(mapStateToProps)(ArgumentDiscussion);
