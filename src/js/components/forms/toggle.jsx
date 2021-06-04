import React from 'react';
import forms from 'newforms';
import i18next from 'i18next';


let ToggleCounterBaseForm = forms.Form.extend({
  // toggleFieldName
  render_toggle_field(className, bf) {
    let { wrapperClass, leftText, rightText } = bf.field.widgetAttrs;
    return (
      <div className={className}>
        <div>{leftText}</div>
        <div className={wrapperClass}>
          {bf.render({ attrs: { ref: 'toggle' } })}
          {bf.labelTag()}
        </div>
        <div>{rightText}</div>
      </div>
    );
  },

  renderField(bf) {
    let className = 'row form-field form-field-' + bf.htmlName;
    // if (bf.errors() && bf.errors().data && bf.errors().data.length > 0) {
    if (bf.errors().isPopulated()) {
      className += ' err';
    }
    let isPending = bf.isPending();
    if (bf.htmlName === this.toggleFieldName) {
      className = className + ' form-field-toggle-field';
      return (this.render_toggle_field(className, bf));
    } else {
      return (
        <div className={className}>
          {bf.label && bf.labelTag()} {bf.render()}
          {isPending && ' '}
          {isPending && this.renderProgress()}
          {bf.errors().render()}
          {bf.helpText && ' '}
          {bf.helpTextTag()}
        </div>
      );
    }
  },

  updateCharCounter(bf) {
    // TODO: Develop more generic approach to this
    if (bf.field.maxLength > 0) {
      let valLength = 0;
      let maxLength = bf.field.maxLength;
      if (typeof this.data[bf.name] !== 'undefined') {
        valLength = this.data[bf.name].length;
      }
      bf.field.helpText = (maxLength - valLength) + ' ' + i18next.t('characters remaining');
    }
  },

  render() {
    let formErrors;
    this.visibleFields().map(this.updateCharCounter.bind(this));
    if (this.nonFieldErrors() && this.nonFieldErrors().data && this.nonFieldErrors().data.length > 0) {
      console.log(formErrors, this.nonFieldErrors());
      formErrors = (
        <ul className="errorlist">
          <li>{this.nonFieldErrors().render()}</li>
        </ul>
      );
    }
    let fields = this.visibleFields().map(
        this.renderField.bind(this)
    );
    return (<div>{formErrors}{fields}</div>);
  },
});

export default ToggleCounterBaseForm;
