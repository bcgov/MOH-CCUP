/**
 * Updates formFields store
 * @param {object} validationObject //vuelidate validation info for the field
 * @param {object} event //new data the field will be updated to
 * @param {string} formFieldParent //the page/view the form field is located in
 * @param {object} store //the form/data store the form field uses
 */
export const handleChangeField = (validationObject, event, formFieldParent, store) => {
  if (validationObject) {
    0;
    validationObject.$touch();

    if (!validationObject.$invalid && event != null && formFieldParent) {
      store.updateFormField(formFieldParent, validationObject.$path, event.target.value);
    }
  }
};
