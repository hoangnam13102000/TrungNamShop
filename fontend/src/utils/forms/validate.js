export const validateGeneral = (formData, rules) => {
  const errors = {};

  for (const field in rules) {
    const { required, type, minLength, match, message } = rules[field];
    const value = formData[field]?.toString().trim();

    // Required
    if (required && !value) {
      errors[field] = message || "Trường này là bắt buộc";
      continue;
    }

    // Email
    if (type === "email" && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      errors[field] = message || "Email không hợp lệ";
      continue;
    }

    // Phone
    if (type === "phone" && value && !/^[0-9]{10,11}$/.test(value)) {
      errors[field] = message || "Số điện thoại không hợp lệ";
      continue;
    }

    // MinLength
    if (minLength && value && value.length < minLength) {
      errors[field] = message || `Phải có ít nhất ${minLength} ký tự`;
      continue;
    }

    // Match
    if (match && value && value !== formData[match]) {
      errors[field] = message || "Giá trị không khớp";
      continue;
    }
  }

  

  return errors;
};
