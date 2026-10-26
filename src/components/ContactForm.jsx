import { useState } from 'react';
import { useAppContext } from '../context/AppContext.jsx';
import { validateContactField, validateContactForm } from '../utils/validators.js';

const INITIAL_VALUES = { name: '', email: '', message: '' };

// ContactForm: name, email and message with validation.
// Messages are saved in localStorage as a demo (no email is really sent).
export default function ContactForm() {
  const { addContactMessage, showToast } = useAppContext();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [sentTo, setSentTo] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    // Clear or update the error while typing once the field already has one.
    if (errors[name]) {
      setErrors({ ...errors, [name]: validateContactField(name, newValues) });
    }
  }

  function handleBlur(event) {
    const { name } = event.target;
    setErrors({ ...errors, [name]: validateContactField(name, values) });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = validateContactForm(values);
    setErrors(newErrors);

    const firstInvalid = ['name', 'email', 'message'].find((field) => newErrors[field]);
    if (firstInvalid) {
      document.getElementById(`contact-${firstInvalid}`).focus();
      return;
    }

    addContactMessage(values);
    showToast('Thanks! Your message has been received.');
    setSentTo(values.name.trim());
    setValues(INITIAL_VALUES);
    setErrors({});
  }

  // Props shared by each field: value, handlers and accessibility links to its error.
  function fieldProps(name) {
    return {
      id: `contact-${name}`,
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': errors[name] ? 'true' : 'false',
      'aria-describedby': errors[name] ? `contact-${name}-error` : undefined,
    };
  }

  function errorText(name) {
    if (!errors[name]) return null;
    return <p id={`contact-${name}-error`} className="field-error">{errors[name]}</p>;
  }

  if (sentTo) {
    return (
      <div className="card form-card center-box" role="status">
        <p className="big-emoji" aria-hidden="true">💌</p>
        <h2>Message sent!</h2>
        <p>Thank you, {sentTo}. We usually reply within one working day.</p>
        <button type="button" className="btn btn-outline" onClick={() => setSentTo('')}>
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate aria-labelledby="contact-form-title">
      <h2 id="contact-form-title">Send us a message</h2>

      <div className="form-group">
        <label htmlFor="contact-name">Your name *</label>
        <input type="text" autoComplete="name" maxLength={60} {...fieldProps('name')} />
        {errorText('name')}
      </div>

      <div className="form-group">
        <label htmlFor="contact-email">Email *</label>
        <input type="email" autoComplete="email" maxLength={80} {...fieldProps('email')} />
        {errorText('email')}
      </div>

      <div className="form-group">
        <label htmlFor="contact-message">Message *</label>
        <textarea rows={5} maxLength={1000} {...fieldProps('message')} />
        {errorText('message')}
      </div>

      <button type="submit" className="btn btn-accent btn-block">Send Message</button>
    </form>
  );
}
