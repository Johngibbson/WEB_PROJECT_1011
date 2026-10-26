// Pure validation functions. Each one takes a value and returns
// an error message string, or an empty string when the value is valid.

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_REGEX = /^[A-Za-z.\s]+$/;
const INDIAN_MOBILE_REGEX = /^[6-9]\d{9}$/;

// Removes spaces, dashes and an optional +91 / 91 / 0 prefix,
// so "+91 98765 43210" becomes "9876543210".
export function normalisePhone(phone) {
  let digits = phone.replace(/[\s-]/g, '');
  if (digits.startsWith('+91')) {
    digits = digits.slice(3);
  } else if (digits.length === 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  } else if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }
  return digits;
}

export function validateName(name) {
  const trimmed = name.trim();
  if (!trimmed) return 'Full name is required.';
  if (!NAME_REGEX.test(trimmed)) return 'Name can only contain letters, spaces and dots.';
  const letterCount = trimmed.replace(/[^A-Za-z]/g, '').length;
  if (letterCount < 3) return 'Name must have at least 3 letters.';
  return '';
}

export function validateEmail(email) {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required.';
  if (!EMAIL_REGEX.test(trimmed)) return 'Please enter a valid email, e.g. name@example.com.';
  return '';
}

export function validatePhone(phone) {
  if (!phone.trim()) return 'Phone number is required.';
  if (!INDIAN_MOBILE_REGEX.test(normalisePhone(phone))) {
    return 'Enter a 10-digit Indian mobile number starting with 6, 7, 8 or 9.';
  }
  return '';
}

// Checks that trimmed text has at least `min` characters.
export function validateMinLength(value, min, label) {
  const length = value.trim().length;
  if (length === 0) return `${label} is required.`;
  if (length < min) return `${label} must be at least ${min} characters (currently ${length}).`;
  return '';
}

export function validateRequiredChoice(value, message) {
  return value ? '' : message;
}

// Validates one field of the adoption form by its name.
export function validateAdoptionField(name, values) {
  switch (name) {
    case 'fullName':
      return validateName(values.fullName);
    case 'email':
      return validateEmail(values.email);
    case 'phone':
      return validatePhone(values.phone);
    case 'address':
      return validateMinLength(values.address, 10, 'Address');
    case 'housing':
      return validateRequiredChoice(values.housing, 'Please choose your housing type.');
    case 'experience':
      return validateRequiredChoice(values.experience, 'Please tell us if you have had pets before.');
    case 'reason':
      return validateMinLength(values.reason, 20, 'Reason for adopting');
    case 'agreement':
      return values.agreement ? '' : 'You must agree to the adoption terms.';
    default:
      return '';
  }
}

// Validates the whole adoption form. Returns an object containing only the fields with errors.
export function validateAdoptionForm(values) {
  const fields = ['fullName', 'email', 'phone', 'address', 'housing', 'experience', 'reason', 'agreement'];
  const errors = {};
  fields.forEach((field) => {
    const message = validateAdoptionField(field, values);
    if (message) errors[field] = message;
  });
  return errors;
}

// Validates one field of the contact form.
export function validateContactField(name, values) {
  switch (name) {
    case 'name':
      return validateName(values.name);
    case 'email':
      return validateEmail(values.email);
    case 'message':
      return validateMinLength(values.message, 10, 'Message');
    default:
      return '';
  }
}

// Validates the whole contact form.
export function validateContactForm(values) {
  const errors = {};
  ['name', 'email', 'message'].forEach((field) => {
    const message = validateContactField(field, values);
    if (message) errors[field] = message;
  });
  return errors;
}
