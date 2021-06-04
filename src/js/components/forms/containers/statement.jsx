import React from 'react';
import AvatarEditor from 'react-avatar-editor';
import API from '../../../api';
import forms from 'newforms';
import { StatementForm, VideoForm } from '../statement';
import { updateFormErrors } from './utils';
import { cutUrlHash } from '../../../utils';
import i18next from 'i18next';


const StatementFormContainer = React.createClass({

  propTypes: {
    initial_data: React.PropTypes.object,
    title: React.PropTypes.string.isRequired,
    discussion: React.PropTypes.object.isRequired,
    handleSubmit: React.PropTypes.func.isRequired,
    handleCancel: React.PropTypes.func.isRequired,
    user: React.PropTypes.object,
  },

  getInitialState() {
    let { initial_data } = this.props;
    let argument_form = StatementForm();
    let video_form = VideoForm();
    let media_type = '';
    let form_data = {};
    if (initial_data.statement) {
      let image = ('original' in initial_data.image) ? initial_data.image.original : '';
      if (image) {
        media_type = 'image';
      } else if (initial_data.video) {
        media_type = 'video';
      }
      form_data.data = {
        statement: initial_data.statement,
        image: image,
        video: initial_data.video ? 'https://youtube.com/v/' + initial_data.video : '',
      };
    }
    return {
      form: new argument_form(form_data),
      video_form: new video_form(form_data),
      media_type: media_type,
      show_spinner: false,
    };
  },

  onSubmit(e) {
    let cleaned_data;
    let { initial_data } = this.props;
    let form = this.state.form;
    let video_form = this.state.video_form;

    let isValid = form.validate() && video_form.validate();
    e.preventDefault();
    if (isValid) {
      this.setState({ 'show_spinner': true });
      cleaned_data = form.cleanedData;
      Object.assign(cleaned_data, video_form.cleanedData);
      let post_data = {
        statement: cleaned_data.statement,
        discussion_id: cutUrlHash(window.brabbl.articleId),
        video: cleaned_data.video,
      };
      if (this.state.media_type === 'image') {
        let imgUrl = this.refs.image.getImage();
        if (imgUrl) {
          post_data.image = imgUrl;
        }
        delete post_data.video;
      } else {
        delete post_data.image;
      }
      let createOrUpdate;
      if (initial_data.statementId) {
        createOrUpdate = API.update_statement(
          initial_data.statementId, post_data);
      } else {
        createOrUpdate = API.create_statement(post_data);
      }
      createOrUpdate
      .then(resp => {
        this.props.handleSubmit(resp);
      })
      .catch(resp => {
        updateFormErrors(form, resp);
        updateFormErrors(video_form, resp);
        this.setState({ 'show_spinner': false });
        this.forceUpdate();
      });
    }
    this.forceUpdate();
  },

  mediaSwitcher() {
    return (<div className="media-switcher">
      <button className={this.isActive('image')} data-type="image" onClick={this.switchMedia}>
        <i className="fa fa-picture-o" aria-hidden="true"></i>{i18next.t('Upload an image')}
      </button>
      <button className={this.isActive('video')} data-type="video" onClick={this.switchMedia}>
        <i className="fa fa-youtube" aria-hidden="true"></i>{i18next.t('Add a Youtube link')}
      </button>
    </div>);
  },

  isActive(button_type) {
    return 'button-media-' + button_type + (this.state.media_type === button_type ? ' active' : '');
  },

  switchMedia(e) {
    this.setState({ media_type: e.currentTarget.dataset.type });
    this.forceUpdate();
    e.preventDefault();
  },

  renderOptionsForm() {
    let form;
    if (this.state.media_type === 'image') {
      let image = this.props.initial_data.image ? this.props.initial_data.image.original : '';
      form = (
        <div className="fullform-section avatar-section">
          <AvatarEditor
            image={image}
            ref="image"
            width={625}
            height={480}
            border={20}
            color={[255, 255, 255, 0.6]}
            scale={1}
          />
        </div>);
    } else if (this.state.media_type === 'video') {
      form = <forms.RenderForm key={2} form={this.state.video_form} ref="VideoForm" />;
    }
    return form;
  },

  render() {
    let headerText;
    let { title, discussion: { statement } } = this.props;
    headerText = (
      <div>
        {title}
        <p>{ i18next.t('to') }</p>
        <h2>{statement}</h2>
      </div>
    );
    let buttonText = this.props.initial_data.statement ? 'Edit' : 'Add new';
    buttonText = this.state.show_spinner ? (<i className="fa fa-spinner fa-spin"></i>) : i18next.t(buttonText);


    return (
      <div className="fullform">
        <div className="fullform-header">
          {headerText}
        </div>
        <div className="fullform-body">
          <form onSubmit={this.onSubmit} ref="statementForm">
            <forms.RenderForm key={2} form={this.state.form} ref="StatementForm" />
            <div className="fullform-section statementForm">
              <h2>{ i18next.t('Add media')}</h2>
              <div className="help-text">{ i18next.t('You can also upload an image or add a Youtube link')}</div>
              {this.mediaSwitcher()}
              {this.renderOptionsForm()}
            </div>
            <div className="fullform-footer">
              <button className="primary" onClick={this.onSubmit} disabled={this.state.show_spinner}>
                {buttonText}
              </button>
              <button onClick={this.props.handleCancel}>{ i18next.t('Cancel') }</button>
            </div>
          </form>
        </div>
      </div>
    );
  },
});

export default StatementFormContainer;
