import forms from 'newforms';
import ToggleCounterBaseForm from './toggle';
import { ONLY_ARGUMENTS, ONLY_BAROMETER, ARGUMENTS_AND_BAROMETER } from '../../constants';
import i18next from 'i18next';
import DateTimePickerField from '../../utils';

const DISCUSSION_TYPE_VALUES = {
  ONLY_ARGUMENTS: { has_barometer: false, has_arguments: true },
  ONLY_BAROMETER: { has_barometer: true, has_arguments: false },
  ARGUMENTS_AND_BAROMETER: { has_barometer: true, has_arguments: true },
};

let DiscussionForm = function DiscussionForm(customer) {
  return ToggleCounterBaseForm.extend({
    rowCssClass: 'row',
    errorCssClass: 'err',
    toggleFieldName: 'multiple_statements_allowed',
    multiple_statements_allowed: forms.BooleanField({
      label: i18next.t('Survey'),
      widgetAttrs: {
        'className': 'toggle',
        'wrapperClass': 'toggleWrapper toggleDiscussion',
        'leftText': i18next.t('Discussion'),
        'rightText': i18next.t('Survey'),
      },
      required: false,
    }),
    statement: forms.CharField({
      label: i18next.t('Thesis statement or question'),
      helpText: '',
      maxLength: 160,
      errorMessages: {
        required: i18next.t('Please provide a thesis statement or question'),
        maxLength: i18next.t('The thesis statement / question must not exceed 160 characters'),
      },
      widget: forms.Textarea,
    }),
    start_time: DateTimePickerField({
      label: i18next.t('Start Time'),
      initial: false,
      required: false,
      widgetAttrs: {
        id: 'start_time_datetime',
      },
    }),
    end_time: DateTimePickerField({
      label: i18next.t('End Time'),
      initial: false,
      required: false,
      widgetAttrs: {
        id: 'end_time_datetime',
      },
    }),
    has_replies: forms.BooleanField({
      label: i18next.t('Allow replies to an arguments'),
      helpText: i18next.t('Users can add replies to an arguments'),
      initial: customer.default_has_replies,
      required: false,
    }),
  });
};

let DiscussionOptionsForm = function DiscussionOptionsForm() {
  return forms.Form.extend({
    rowCssClass: 'row',
    errorCssClass: 'err',
    discussionType: forms.TypedChoiceField({
      label: '',
      choices: [
        [ONLY_ARGUMENTS, i18next.t('Just arguments')],
        [ONLY_BAROMETER, i18next.t('Just the Opiniometer')],
        [ARGUMENTS_AND_BAROMETER, i18next.t('Opiniometer plus Arguments')],
      ],
      coerce: (val) => DISCUSSION_TYPE_VALUES[val],
      required: true,
      errorMessages: {
        required: i18next.t('Please select the type of discussion'),
      },
      widget: forms.RadioSelect }),
    barometerType: forms.ChoiceField({
      label: i18next.t('Please select the Wording schema'),
      required: true,
      errorMessages: {
        required: i18next.t('Please select the Wording schema'),
      },
      widget: forms.RadioSelect,
    }),

    constructor(kwargs) {
      DiscussionOptionsForm().__super__.constructor.call(this, kwargs);
      if (kwargs.barometerOptions) {
        let choices = kwargs.barometerOptions.map(option => [option.id, option.name]);
        this.fields.barometerType.setChoices(choices);
      }
    },
  });
};

let SurveyOptionsForm = function SurveyOptionsForm() {
  return forms.Form.extend({
    rowCssClass: 'row',
    errorCssClass: 'err',
    user_can_add_replies: forms.ChoiceField({
      label: '',
      initial: true,
      choices: [
        [true, i18next.t('Allow suggestions by users')],
        [false, i18next.t('Allow suggestions by admins only')],
      ],
      required: false,
      widget: forms.RadioSelect,
    }),
  });
};

export { DiscussionForm, DiscussionOptionsForm, SurveyOptionsForm };
