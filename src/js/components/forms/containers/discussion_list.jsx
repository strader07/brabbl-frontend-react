import React from 'react';
import forms from 'newforms';
import TagsInput from 'react-tagsinput';
import API from '../../../api';
import { updateFormErrors } from './utils';
import { cutUrlHash } from '../../../utils';
import DiscussionListForm from '../discussion_list';
import i18next from 'i18next';


const DiscussionListFormContainer = React.createClass({

  propTypes: {
    onSubmit: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    customer: React.PropTypes.object.isRequired,
    initial_data: React.PropTypes.object,
    user: React.PropTypes.object,
  },

  getInitialState() {
    let { initial_data } = this.props;
    let tags = [];
    let formData = {};
    if (initial_data) {
      tags = initial_data.tags;
    }
    if (this.props.initial_data) {
      tags = this.props.initial_data.tags;
      Object.assign(formData, { data: this.props.initial_data });
    }
    let disc_list_form = DiscussionListForm();
    return {
      forms: {
        discussion_list: new disc_list_form(formData),
      },
      tags: tags,
      show_spinner: false,
    };
  },

  onSubmit(e) {
    e.preventDefault();
    let action = 'create';
    let data = {
      tags: this.state.tags,
      url: cutUrlHash(window.location.href),
    };
    if (this.props.initial_data) {
      data = this.props.initial_data;
      action = 'edit';
    }
    this.submitForm(data, action);
  },

  submitForm(data, action) {
    let discussionListForm = this.state.forms.discussion_list;

    if (discussionListForm.validate()) {
      this.setState({ 'show_spinner': true });
      // flatten & merge data
      Object.assign(data, discussionListForm.cleanedData);

      // convert some values to the format expected by the API
      data.tags = this.state.tags;

      // send data
      let createOrUpdate;
      if (action === 'create') {
        createOrUpdate = API.create_discussion_list(data);
      } else {
        createOrUpdate = API.update_discussion_list(data.url, data);
      }

      createOrUpdate.then(resp => {
        this.props.onSubmit(resp.data);
      })
        .catch(resp => {
          updateFormErrors(discussionListForm, resp);
          this.setState({ 'show_spinner': false });
          this.forceUpdate();
        });
    } else {
      this.forceUpdate();
    }
  },

  render() {
    let buttonText = this.state.show_spinner ? (
      <i className="fa fa-spinner fa-spin"></i>) : i18next.t('Save List');
    return (
      <form onSubmit={this.onSubmit}>
        <div className="fullform-section DiscussionListForm">
          <h2>{ i18next.t('Discussion List')}</h2>
          <forms.RenderForm form={this.state.forms.discussion_list} ref="discussionListForm" />
          <h2>{ i18next.t('Tags')}</h2>
          <TagsInput
            value={this.state.tags}
            inputProps={{ 'placeholder': i18next.t('Add a tag') }}
            onChange={(v) => this.setState({ tags: v })}
          />
          <span className="helpText">{i18next.t('Press enter to add a tag')}</span>
        </div>
        <div className="fullform-footer">
          <button className="primary" disabled={this.state.show_spinner}>{ buttonText }</button>
          <button onClick={this.props.onCancel}>{ i18next.t('cancel') }</button>
        </div>
      </form>
    );
  },
});

export default DiscussionListFormContainer;
