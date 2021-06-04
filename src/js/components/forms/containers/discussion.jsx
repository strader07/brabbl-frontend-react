import React from 'react';
import forms from 'newforms';
import AvatarEditor from 'react-avatar-editor';
import TagsInput from 'react-tagsinput';
import API from '../../../api';
import { DiscussionOptionsForm, DiscussionForm, SurveyOptionsForm } from '../discussion';
import { updateFormErrors } from './utils';
import { ONLY_ARGUMENTS, ONLY_BAROMETER, ARGUMENTS_AND_BAROMETER } from '../../../constants';
import i18next from 'i18next';


const DiscussionFormContainer = React.createClass({

  propTypes: {
    initial_data: React.PropTypes.object,
    customer: React.PropTypes.object.isRequired,
    onSubmit: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired,
    onDelete: React.PropTypes.func.isRequired,
  },

  getInitialState() {
    let { initial_data, customer } = this.props,
      discussionType,
      barometerType = 'empty',
      initialTab = 'discussion',
      tags = window.brabbl.defaultTags ? window.brabbl.defaultTags : [];
    if (customer.barometerOptions.length > 0) {
      barometerType = customer.barometerOptions[0].id;
    }
    if (initial_data) {
      let { has_barometer, has_arguments, barometer_wording } = initial_data;
      if (this.props.initial_data.multiple_statements_allowed) {
        initialTab = 'survey';
      }
      if (has_barometer && !has_arguments) {
        discussionType = ONLY_BAROMETER;
      } else if (has_arguments && !has_barometer) {
        discussionType = ONLY_ARGUMENTS;
      } else {
        discussionType = ARGUMENTS_AND_BAROMETER;
      }
      barometerType = barometer_wording;
      tags = initial_data.tags;
    } else {
      discussionType = ARGUMENTS_AND_BAROMETER;
    }

    let formData = { onChange: this.handleChange.bind(this) };

    if (initial_data) {
      Object.assign(formData, { data: initial_data });
    }

    let optionsFormData = Object.assign(formData, {
      discussionType: discussionType,
      barometerType: barometerType,
    });

    let surveyFormData = Object.assign(formData, { user_can_add_replies: false });
    let disk_form = DiscussionForm(customer);
    let serv_opt_form = SurveyOptionsForm();
    let disk_opt_form = DiscussionOptionsForm();

    return {
      forms: {
        discussion: new disk_form(formData),
        surveyOptions: new serv_opt_form(surveyFormData),
        discussionOptions: new disk_opt_form({
          data: optionsFormData,
          barometerOptions: this.props.customer.barometerOptions,
        }
        ),
      },
      tags: tags,
      showOptions: initialTab,
      show_spinner: false,
    };
  },

  onSubmit(e) {
    e.preventDefault();
    let action = 'create';
    let data = {
      tags: this.state.tags,
      external_id: window.brabbl.articleId,
      url: window.location.href,
    };
    if (this.props.initial_data) {
      data = this.props.initial_data;
      action = 'edit';
    }
    this.submitForm(data, action);
  },

  handleChange() {
    let show_survey = ['on', true].indexOf(this.state.forms.discussion.data.multiple_statements_allowed) !== -1;
    if (show_survey) {
      this.setState({ 'showOptions': 'survey' });
    } else {
      this.setState({ 'showOptions': 'discussion' });
    }
    this.forceUpdate();
  },

  submitForm(data, action) {
    let discussionForm = this.state.forms.discussion;
    let discussionOptionsForm = this.state.forms.discussionOptions;
    let surveyOptionsForm = this.state.forms.surveyOptions;

    if (discussionForm.validate()
        && discussionOptionsForm.validate()
        && surveyOptionsForm.validate()) {
      this.setState({ 'show_spinner': true });
      // flatten & merge data
      Object.assign(data, discussionOptionsForm.cleanedData,
          surveyOptionsForm.cleanedData, discussionForm.cleanedData
      );

      // convert some values to the format expected by the API
      let discussionType = discussionOptionsForm.cleanedData.discussionType;
      data.has_barometer = discussionType.has_barometer;
      data.has_arguments = discussionType.has_arguments;
      delete data.discussionType;
      data.wording = discussionOptionsForm.cleanedData.barometerType;
      delete data.barometerType;
      data.user_can_add_replies = surveyOptionsForm.cleanedData.user_can_add_replies;
      data.tags = this.state.tags;
      let imgUrl = this.refs.image.getImage();
      if (imgUrl) {
        data.image = imgUrl;
      }
      // send data
      let createOrUpdate;
      if (action === 'create') {
        createOrUpdate = API.create_discussion(data);
      } else {
        createOrUpdate = API.update_discussion(data.external_id, data);
      }

      createOrUpdate.then(resp => {
        this.props.onSubmit(resp.data);
      })
      .catch(resp => {
        updateFormErrors(discussionForm, resp);
        updateFormErrors(discussionOptionsForm, resp);
        updateFormErrors(surveyOptionsForm, resp);
        this.setState({ 'show_spinner': false });
        this.forceUpdate();
      });
    } else {
      this.forceUpdate();
    }
  },

  renderOptionsForm() {
    let form;
    if (this.state.showOptions === 'discussion') {
      form = <forms.RenderForm key={1} form={this.state.forms.discussionOptions} ref="discussionOptionsForm" />;
    } else {
      form = (
        <div>
          <forms.RenderForm key={1} form={this.state.forms.discussionOptions} ref="discussionOptionsForm" />
          <h2>{ i18next.t('Survey')}</h2>
          <forms.RenderForm key={2} form={this.state.forms.surveyOptions} ref="surveyOptionsForm" />
        </div>
      );
    }
    return form;
  },

  render() {
    let title = this.state.showOptions === 'discussion' ? 'Discussion' : 'Survey';
    let buttonText = this.props.initial_data ? `Edit ${title}` : `Add new ${title}`;
    let image = this.props.initial_data ? this.props.initial_data.image_url : '';
    buttonText = this.state.show_spinner ? (<i className="fa fa-spinner fa-spin"></i>) : i18next.t(buttonText);
    return (
      <form onSubmit={this.onSubmit}>
        <div className="fullform-section createDiscussionForm">
          <h2>{ i18next.t('Discussion')}</h2>
          {this.state.forms.discussion.render()}
        </div>
        <div className="fullform-section optionsForm">
          <h2>{ i18next.t('Tags')}</h2>
          <TagsInput
            value={this.state.tags}
            inputProps={{ 'placeholder': i18next.t('Add a tag') }}
            onChange={(v) => this.setState({ tags: v })}
          />
          <span className="helpText">{i18next.t('Press enter to add a tag')}</span>
          <h2>{ i18next.t('Settings')}</h2>
          {this.renderOptionsForm()}
        </div>
        <div className="fullform-section avatar-section">
          <h2>{ i18next.t('Image')}</h2>
          <AvatarEditor
            image={image}
            ref="image"
            width={300}
            height={200}
            border={20}
            color={[255, 255, 255, 0.6]}
            scale={1}
          />
          <div className="help-text">
            { i18next.t(
              'Please drag a picture to the image area to change discussion picture'
            )}
          </div>
        </div>
        <div className="fullform-footer">
          <button className="primary" disabled={this.state.show_spinner}>{ buttonText }</button>
          <button onClick={this.props.onDelete} disabled={this.state.show_spinner}>
            { i18next.t('Delete discussion') }
          </button>
          <button onClick={this.props.onCancel}>{ i18next.t('cancel') }</button>
        </div>
      </form>
    );
  },
});

export default DiscussionFormContainer;
