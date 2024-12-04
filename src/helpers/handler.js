import { useFormStore } from "@/stores/formData";
export function handleChangeField(validationObject, event, formFieldParent) {
  if (validationObject) {
    validationObject.$touch();

    if (!validationObject.$invalid && event != null && formFieldParent) {
      // update pinia store
      const store = useFormStore();
      store.updateFormField(formFieldParent, validationObject.$path, event.target.value);
    }
  }
}
