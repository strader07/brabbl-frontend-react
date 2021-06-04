import forms from 'newforms';
import i18next from 'i18next';


let StatementForm = function StatementForm() {
  return forms.Form.extend({
    rowCssClass: 'row',
    errorCssClass: 'err',
    statement: forms.CharField({
      widget: forms.Textarea,
      label: i18next.t('Suggestion'),
      maxLength: 300,
      errorMessages: {
        required: i18next.t('Please provide a suggestion'),
      },
    }),
  });
};

let VideoForm = function VideoForm() {
  return forms.Form.extend({

    rowCssClass: 'row',
    errorCssClass: 'err',
    video: forms.URLField({
      label: '',
      initial: '',
      required: false,
    }),
  });
};

export default { StatementForm, VideoForm };
