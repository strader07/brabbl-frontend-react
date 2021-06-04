import forms from 'newforms';
import i18next from 'i18next';
import { DISPLAY_USERNAME } from '../../constants';

let SignUpForm = function SignUpForm(customer) {
  let showUsername = customer.displayed_username === DISPLAY_USERNAME;
  return forms.Form.extend({
    rowCssClass: 'row',
    errorCssClass: 'err',
    username: forms.CharField({
      required: showUsername,
      cssClass: !showUsername ? 'is-hidden' : '',
      label: i18next.t('User name'),
      errorMessages: {
        required: i18next.t('Please provide a (unique) username'),
      },
    }),
    first_name: forms.CharField({
      required: true,
      label: i18next.t('First name'),
      errorMessages: {
        required: i18next.t('Please provide a fist name'),
      },
    }),
    last_name: forms.CharField({
      required: true,
      label: i18next.t('Last name'),
      errorMessages: {
        required: i18next.t('Please provide a last name'),
      },
    }),
    email: forms.EmailField({
      required: true,
      label: i18next.t('Email Address'),
      errorMessages: {
        required: i18next.t('Please provide an email address'),
        invalid: i18next.t('Please provide a valid email address'),
      },
    }),
    password: forms.CharField({
      widget: forms.PasswordInput,
      label: i18next.t('Password'),
      errorMessages: {
        required: i18next.t('Please provide a password'),
      },
    }),
    confirmPassword: forms.CharField({
      widget: forms.PasswordInput,
      label: i18next.t('Password'),
      errorMessages: {
        required: i18next.t('Please enter a password again'),
      },
    }),
    clean() {
      if (!showUsername) {
        this.cleanedData.username = this.cleanedData.email;
      }
      if (this.cleanedData.password &&
          this.cleanedData.confirmPassword &&
          this.cleanedData.password !== this.cleanedData.confirmPassword) {
        throw forms.ValidationError(i18next.t('The passwords do not match'));
      }
    },
  });
};

export default SignUpForm;
