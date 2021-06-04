import React from 'react';
import { showModal } from '../../actions/app';
import { MODAL_DISCUSSION } from '../../constants';
import { Option, OptionsList } from '../options';
import i18next from 'i18next';


const ListStatementWrapper = (Statement) => class extends React.Component {

  static propTypes = {
    statement: React.PropTypes.object.isRequired,
  }

  getTitle() {
    let { url, statement } = this.props.statement;
    return (<h3 className="discussion-list-item-title">
        <a href={url + '#brabbl-widget'}>{statement}</a>
      </h3>);
  }

  getOptionsList() {
    let { is_editable: isEditable } = this.props.statement;
    let { dispatch } = this.props;
    let optionsList;
    if (isEditable) {
      optionsList = (
        <OptionsList>
          <Option
            icon="pencil"
            onClick={() => dispatch(
              showModal(MODAL_DISCUSSION, {
                discussion: this.props.statement,
              }))}
          >
            { i18next.t('Edit discussion') }
          </Option>
        </OptionsList>
      );
    }
    return optionsList;
  }

  render() {
    let { statement } = this.props;
    let url = statement.url + '#brabbl-widget';
    return (
      <Statement
        { ...this.props}
        statement={statement}
        id={statement.external_id}
        title={this.getTitle()}
        optionsList={this.getOptionsList()}
        barometerActive={!statement.multiple_statements_allowed}
        handleStatementClick={() => document.location.replace(url)}
      />
    );
  }
};

export default ListStatementWrapper;
