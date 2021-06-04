import React from 'react';
import { StatementFormContainer } from '../forms';
import { hideModal } from '../../actions/app';
import { reloadDiscussion } from '../../actions/async';
import { UseWording } from '../../utils';
import i18next from 'i18next';

let StatementModal = React.createClass({

  propTypes: {
    user: React.PropTypes.object.isRequired,
    customer: React.PropTypes.object.isRequired,
    discussion: React.PropTypes.object.isRequired,
    initial_data: React.PropTypes.object,
  },

  onSubmit(resp) {
    this.props.dispatch(reloadDiscussion());
    location.hash = `statement-${resp.data.id}`;
  },

  onCancel(e) {
    e.preventDefault();
    this.props.dispatch(hideModal());
  },
  render() {
    let { customer, discussion, initial_data } = this.props;
    let title = (
      <h1>
        {initial_data.statement ? i18next.t('Edit suggestion') : UseWording(
          this.props, 'survey_add_answer_button_bottom'
        )}
      </h1>
    );
    return (
      <div className="fullform discussion-create">
        <StatementFormContainer
          customer={customer}
          discussion={discussion}
          title={title}
          initial_data={initial_data}
          handleSubmit={this.onSubmit}
          handleCancel={this.onCancel}
        />
      </div>
    );
  },
});

export default StatementModal;
