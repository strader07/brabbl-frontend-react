import React from 'react';
import ArgumentForm from '../argument';
import API from '../../../api';
import { updateFormErrors } from './utils';
import i18next from 'i18next';
import { UseWording } from '../../../utils';

const ArgumentFormContainer = React.createClass({

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
    statement: React.PropTypes.object,
    argument: React.PropTypes.object,
    title: React.PropTypes.string.isRequired,
    initial_data: React.PropTypes.object,
    is_pro: React.PropTypes.bool.isRequired,
  },

  getInitialState() {
    let form_data = { onChange: this.forceUpdate.bind(this) };
    let argument_form = ArgumentForm();
    if (this.props.initial_data) {
      Object.assign(form_data, { data: this.props.initial_data });
    }
    return {
      form: new argument_form(form_data),
      show_spinner: false,
    };
  },

  onSubmit(e) {
    e.preventDefault();
    let data;
    let form = this.state.form;
    let isValid = form.validate();
    if (isValid) {
      this.setState({ 'show_spinner': true });
      data = form.cleanedData;
      data.statement_id = this.props.statement.id;
      if (this.props.initial_data) {
        this.updateArgument(data, form);
      } else {
        if (this.props.argument) {
          data.reply_to = this.props.argument.id;
        }
        data.is_pro = this.props.is_pro;
        this.createArgument(data, form);
      }
    }
    this.forceUpdate();
  },

  createArgument(data, form) {
    API.create_argument(data)
      .then(() => {
        this.props.onSubmit(data);
      })
      .catch(resp => {
        updateFormErrors(form, resp);
        this.setState({ 'show_spinner': false });
        this.forceUpdate();
      });
  },

  updateArgument(data, form) {
    delete data.statement_id;
    API.update_argument(this.props.initial_data.id, data)
      .then(() => {
        this.props.onSubmit(data);
        this.setState({ 'show_spinner': false });
      })
      .catch(resp => {
        updateFormErrors(form, resp);
        this.setState({ 'show_spinner': false });
        this.forceUpdate();
      });
  },

  render() {
    let { initial_data } = this.props;
    let { form } = this.state;
    let headerText,
      buttonText;
    let formTitle = (this.props.is_pro === true) ? UseWording(this.props, 'button_new_pro') : UseWording(
      this.props, 'button_new_contra');
    if (initial_data) {
      buttonText = 'Update Argument';
      headerText = (<h1>{ i18next.t('Update Argument') }</h1>);
    } else {
      buttonText = 'Publish Argument';
      headerText = (
        <div>
          <h1>{ i18next.t(formTitle) }</h1>
          <p>{ i18next.t('to') }</p>
          <h2>{this.props.title}</h2>
        </div>
      );
    }
    buttonText = this.state.show_spinner ? (<i className="fa fa-spinner fa-spin"></i>) : i18next.t(buttonText);
    return (
      <div className="fullform">
        <div className="fullform-header">
          {headerText}
        </div>
        <div className="fullform-body">
          <form ref="form" onSubmit={this.onSubmit}>
            <div className="fullform-section createArgumentForm">
              {form.render()}
            </div>
            <div className="fullform-footer">
              <button className="primary" disabled={this.state.show_spinner}>{buttonText}</button>
            </div>
          </form>
        </div>
      </div>
    );
  },
});

export default ArgumentFormContainer;
