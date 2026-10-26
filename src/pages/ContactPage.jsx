import ContactForm from '../components/ContactForm.jsx';
import usePageTitle from '../hooks/usePageTitle.js';

const CONTACT_INFO = [
  { icon: '📍', title: 'Address', lines: ['12, Lake View Road, T. Nagar', 'Chennai, Tamil Nadu 600017'] },
  { icon: '📞', title: 'Phone', lines: ['+91 98765 43210'] },
  { icon: '✉️', title: 'Email', lines: ['hello@pawfectmatch.in'] },
  { icon: '🕒', title: 'Working hours', lines: ['Mon to Sat: 10:00 am to 6:00 pm', 'Sunday: closed (emergencies only)'] },
];

// ContactPage: /contact. Contact details next to the contact form.
export default function ContactPage() {
  usePageTitle('Contact');

  return (
    <>
      <section className="page-banner">
        <div className="container">
          <h1>Contact Us</h1>
          <p>Questions about a pet or about adoption? We would love to hear from you.</p>
        </div>
      </section>
      <section className="page-section">
        <div className="container contact-grid">
          <ul className="contact-info">
            {CONTACT_INFO.map((item) => (
              <li key={item.title} className="card contact-item">
                <span className="step-icon" aria-hidden="true">{item.icon}</span>
                <div>
                  <h2>{item.title}</h2>
                  {item.lines.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
