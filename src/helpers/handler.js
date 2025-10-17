import { useDocSubmissionStore } from "@/stores/docSubmissionStore";
export function handleChangeField(validationObject, event, formFieldParent) {
  if (validationObject) {
    validationObject.$touch();

    if (!validationObject.$invalid && event != null && formFieldParent) {
      const store = useDocSubmissionStore();
      store.updateFormField(formFieldParent, validationObject.$path, event.target.value);
    }
  }
}
