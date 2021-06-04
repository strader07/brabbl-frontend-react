import React from 'react';
import i18next from 'i18next';


const MarkupWording = React.createClass({
  propTypes: {
    wording: React.PropTypes.string.isRequired,
    customer: React.PropTypes.object.isRequired,

  },

  getValue() {
    let { wording, customer } = this.props;
    let default_wordings = this.defaultWordings();
    let wordings = customer.markdown_wording;
    if (wording in wordings && wordings[wording].length > 0) {
      return wordings[wording];
    } else if (wording in default_wordings) {
      return default_wordings[wording];
    } else {
      return '';
    }
  },

  defaultWordings() {
    return {
      sign_up_title: i18next.t('Sign up with'),
      sign_up_text: i18next.t('Sign Up Text'),
      login_title: i18next.t('Login to participate'),
      login_text: '',
      welcome_title: i18next.t('Welcome Title'),
      welcome_text_social: i18next.t('Welcome Text (after Social-Auth Sign Up)'),
      welcome_text_email: i18next.t('Welcome Text (after Email Sign Up)'),
      barometer_start_sign: i18next.t('What do you think?'),
      hidden_argument_title: i18next.t('Content removed'),
      hidden_argument_text: i18next.t('This content was inappropriate and has been removed by our staff') + '. ' +
      i18next.t('Please stick to our guidelines for good discussions and refrain from posts that are likely to be' +
        ' regarded as offensive or rude') + '.',

    };
  },

  render() {
    return <span dangerouslySetInnerHTML={{ __html: this.getValue() }}></span>;
  },
});

export default MarkupWording;
