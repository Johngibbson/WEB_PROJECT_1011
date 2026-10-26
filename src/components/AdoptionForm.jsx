import { useEffect, useRef, useState } from 'react';
import PetImage from './PetImage.jsx';
import { useAppContext } from '../context/AppContext.jsx';
import { validateAdoptionField, validateAdoptionForm } from '../utils/validators.js';
import { formatAge } from '../utils/helpers.js';

const INITIAL_VALUES = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  housing: '',
  experience: '',
  experienceDetails: '',
  reason: '',
  agreement: false,
};

// The order fields appear in, used to focus the first invalid one.
const FIELD_ORDER = ['fullName', 'email', 'phone', 'address', 'housing', 'experience', 'reason', 'agreement'];

// The id of the input that should receive focus for each field.
function inputId(field) {
  return `adopt-${field}`;
}

// AdoptionForm: the adoption request form with live validation.
// Props: pet (the pet being adopted), onSuccess (called with the saved request).
export default function AdoptionForm({ pet, onSuccess }) {
  const { addRequest, showToast } = useAppContext();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formMessage, setFormMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // A ref changes instantly (state waits for the next render), so it stops rapid double-clicks.
  const submittingRef = useRef(false);

  const isDirty = Object.keys(INITIAL_VALUES).some((key) => values[key] !== INITIAL_VALUES[key]);

  // Warn before closing or refreshing the tab if the form is partly filled.
  useEffect(() => {
    if (!isDirty) return undefined;
    function handleBeforeUnload(event) {
      event.preventDefault();
      event.returnValue = '';
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  // Updates one field. If the field was already visited, re-check it as the user types.
  function handleChange(event) {
    const { name, type, value, checked } = event.target;
    const newValues = { ...values, [name]: type === 'checkbox' ? checked : value };
    setValues(newValues);
    if (touched[name]) {
      setErrors({ ...errors, [name]: validateAdoptionField(name, newValues) });
    }
  }

  // When the user leaves a field, mark it as visited and validate it.
  function handleBlur(event) {
    const { name } = event.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateAdoptionField(name, values) });
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (submittingRef.current) return;

    const newErrors = validateAdoptionForm(values);
    setErrors(newErrors);
    setTouched(Object.fromEntries(FIELD_ORDER.map((field) => [field, true])));

    const firstInvalid = FIELD_ORDER.find((field) => newErrors[field]);
    if (firstInvalid) {
      setFormMessage('Please fix the highlighted fields below.');
      document.getElementById(inputId(firstInvalid)).focus();
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setFormMessage('');

    const result = addRequest(values, pet);
    if (!result.ok) {
      setFormMessage(result.error);
      showToast(result.error, 'error');
      submittingRef.current = false;
      setIsSubmitting(false);
      return;
    }

    showToast(`Your request for ${pet.name} was submitted!`);
    onSuccess(result.request);
  }

  // Props shared by every text input: value, handlers and accessibility links to the error message.
  function fieldProps(name) {
    return {
      id: inputId(name),
      name,
      value: values[name],
      onChange: handleChange,
      onBlur: handleBlur,
      'aria-invalid': errors[name] ? 'true' : 'false',
      'aria-describedby': errors[name] ? `${inputId(name)}-error` : undefined,
    };
  }

  // Small red message shown under a field when it has an error.
  function errorText(name) {
    if (!errors[name]) return null;
    return (
      <p id={`${inputId(name)}-error`} className="field-error">
        {errors[name]}
      </p>
    );
  }

  const reasonLength = values.reason.trim().length;

  return (
    <form className="card form-card" onSubmit={handleSubmit} noValidate>
      <div className="selected-pet">
        <PetImage src={pet.image} alt={`Photo of ${pet.name}`} />
        <div>
          <p className="selected-pet-label">You are applying to adopt</p>
          <p className="selected-pet-name">{pet.name}</p>
          <p className="muted">
            {pet.breed} · {formatAge(pet.age)} · {pet.gender} · {pet.location}
          </p>
        </div>
      </div>

      <p className={formMessage ? 'form-message error' : 'visually-hidden'} role="alert" aria-live="assertive">
        {formMessage}
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor={inputId('fullName')}>Full name *</label>
          <input type="text" autoComplete="name" maxLength={60} {...fieldProps('fullName')} />
          {errorText('fullName')}
        </div>

        <div className="form-group">
          <label htmlFor={inputId('email')}>Email *</label>
          <input type="email" autoComplete="email" maxLength={80} {...fieldProps('email')} />
          {errorText('email')}
        </div>

        <div className="form-group">
          <label htmlFor={inputId('phone')}>Mobile number *</label>
          <input type="tel" autoComplete="tel" placeholder="+91 98765 43210" maxLength={16} {...fieldProps('phone')} />
          {errorText('phone')}
        </div>

        <div className="form-group form-group-wide">
          <label htmlFor={inputId('address')}>Address *</label>
          <textarea rows={2} autoComplete="street-address" maxLength={250} {...fieldProps('address')} />
          {errorText('address')}
        </div>
      </div>

      <fieldset className="form-group radio-group">
        <legend>Housing type *</legend>
        {['House', 'Apartment'].map((option, index) => (
          <label key={option} className="radio-label">
            <input
              type="radio"
              id={index === 0 ? inputId('housing') : undefined}
              name="housing"
              value={option}
              checked={values.housing === option}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-describedby={errors.housing ? `${inputId('housing')}-error` : undefined}
            />
            {option}
          </label>
        ))}
        {errorText('housing')}
      </fieldset>

      <fieldset className="form-group radio-group">
        <legend>Have you had pets before? *</legend>
        {['Yes', 'No'].map((option, index) => (
          <label key={option} className="radio-label">
            <input
              type="radio"
              id={index === 0 ? inputId('experience') : undefined}
              name="experience"
              value={option}
              checked={values.experience === option}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-describedby={errors.experience ? `${inputId('experience')}-error` : undefined}
            />
            {option}
          </label>
        ))}
        {errorText('experience')}
      </fieldset>

      {values.experience === 'Yes' && (
        <div className="form-group">
          <label htmlFor={inputId('experienceDetails')}>Tell us about your previous pets (optional)</label>
          <textarea rows={2} maxLength={300} {...fieldProps('experienceDetails')} />
        </div>
      )}

      <div className="form-group">
        <label htmlFor={inputId('reason')}>Why do you want to adopt {pet.name}? *</label>
        <textarea
          rows={4}
          maxLength={1000}
          {...fieldProps('reason')}
          aria-describedby={`${inputId('reason')}-counter${errors.reason ? ` ${inputId('reason')}-error` : ''}`}
        />
        <p id={`${inputId('reason')}-counter`} className={reasonLength >= 20 ? 'char-counter ok' : 'char-counter'}>
          {reasonLength} characters (minimum 20)
        </p>
        {errorText('reason')}
      </div>

      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            id={inputId('agreement')}
            name="agreement"
            checked={values.agreement}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-describedby={errors.agreement ? `${inputId('agreement')}-error` : undefined}
          />
          I agree to a home visit, to provide lifelong care, and to keep {pet.name} vaccinated and healthy. *
        </label>
        {errorText('agreement')}
      </div>

      <button type="submit" className="btn btn-accent btn-lg btn-block" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Submit Adoption Request'}
      </button>
    </form>
  );
}
