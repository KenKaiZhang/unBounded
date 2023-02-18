function validateFieldsFilled(formId) {
  const inputs = document.querySelectorAll(formId);
  for (let i = 0; i < inputs.length; i++) {
    if (inputs[i].value == "") {
      return false;
    }
  }
  return true;
}
