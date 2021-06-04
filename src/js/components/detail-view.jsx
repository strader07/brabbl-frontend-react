import React from 'react';
import { connect } from 'react-redux';
import { ArgumentDiscussion, Discussion, StatementDiscussion,
  SurveyList } from './discussion';

const DetailView = (props) => {
  let { discussion, statementId, argumentId } = props;
  if (argumentId) {
    return <ArgumentDiscussion {...props} />;
  }

  if (statementId) {
    return <StatementDiscussion {...props} />;
  }

  if (discussion.multiple_statements_allowed) {
    return <SurveyList {...props} />;
  }

  return <Discussion {...props} />;
};

DetailView.propTypes = {
  discussion: React.PropTypes.object,
  customer: React.PropTypes.object.isRequired,
  articleId: React.PropTypes.string.isRequired,
  statementId: React.PropTypes.number,
  argumentId: React.PropTypes.number,
};

const mapStateToProps = (state) => ({
  discussion: state.discussion,
});

export default connect(mapStateToProps)(DetailView);
