import AutoNumeric from 'autonumeric';

export default {
  mounted(el: HTMLElement, binding: any) {
    const options = binding.value || {
      digitGroupSeparator: ',',
      decimalCharacter: '.',
      decimalPlaces: 2,
    };

    const autoNumericInstance = new AutoNumeric(el, options);

    // Sync changes back to the model
    el.addEventListener('input', () => {
      const event = new CustomEvent('update:modelValue', {
        detail: autoNumericInstance.getNumber(),
      });
      el.dispatchEvent(event);
    });

    // Save the instance for cleanup
    el.__autoNumericInstance = autoNumericInstance;
  },
  beforeUnmount(el: HTMLElement) {
    if (el.__autoNumericInstance) {
      el.__autoNumericInstance.remove();
      delete el.__autoNumericInstance;
    }
  },
};
