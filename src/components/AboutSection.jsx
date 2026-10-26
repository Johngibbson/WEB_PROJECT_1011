import { useState } from 'react';
import HowItWorks from './HowItWorks.jsx';

const ABOUT_STEPS = [
  { icon: '🔍', title: 'Browse profiles', text: 'Search and filter pets by type, age and gender. Read about their health and personality.' },
  { icon: '📝', title: 'Send a request', text: 'Fill in a short adoption form telling us about your home and why you would like to adopt.' },
  { icon: '📞', title: 'Meet and greet', text: 'Our team reviews your request, calls you, and arranges a visit to meet the pet.' },
  { icon: '🏡', title: 'Welcome home', text: 'Once approved, complete a simple adoption agreement and take your new friend home.' },
];

const CHECKLIST = [
  { icon: '💰', title: 'Budget', text: 'Food, litter, toys, grooming and vet bills add up. Plan a monthly pet budget.' },
  { icon: '⏰', title: 'Time', text: 'Pets need daily feeding, exercise, play and attention, not just weekends.' },
  { icon: '🩺', title: 'Vet care', text: 'Find a nearby vet and plan regular check-ups and emergency care.' },
  { icon: '💉', title: 'Vaccination', text: 'Keep vaccines such as rabies and core boosters up to date every year.' },
  { icon: '✂️', title: 'Neutering', text: 'Spaying or neutering prevents unwanted litters and many health problems.' },
  { icon: '❤️', title: 'Lifelong commitment', text: 'Dogs and cats can live 12 to 18 years. Adoption is a promise for their whole life.' },
];

const FAQS = [
  {
    question: 'Is there an adoption fee?',
    answer: 'There is a small fee of ₹500 to ₹1,500 that covers vaccination, deworming and neutering costs. It is collected only after approval.',
  },
  {
    question: 'How long does approval take?',
    answer: 'Usually 2 to 3 working days. We call you, answer your questions and arrange a meet-and-greet.',
  },
  {
    question: 'Can I adopt if I live in an apartment?',
    answer: 'Yes! Many of our pets, such as cats, rabbits and calm adult dogs, are happy in apartments. Tell us about your home in the form.',
  },
  {
    question: 'What if the pet does not settle in?',
    answer: 'Contact us. We offer free advice from our trainers, and if it truly does not work out, we take the pet back. Please never abandon a pet.',
  },
];

// AboutSection: mission, how it works, a responsible-adoption checklist and an FAQ accordion.
export default function AboutSection() {
  // Index of the open FAQ, or null when all are closed.
  const [openFaq, setOpenFaq] = useState(null);

  function toggleFaq(index) {
    setOpenFaq(openFaq === index ? null : index);
  }

  return (
    <>
      <section className="page-section" aria-labelledby="mission-title">
        <div className="container mission">
          <h2 id="mission-title" className="section-title">Our mission</h2>
          <p>
            Pawfect Match is a volunteer-run rescue network. We rescue abandoned and injured animals,
            give them medical care and a safe foster home, and then help them find loving, responsible families.
            We believe every pet deserves a second chance and every family deserves the right companion.
          </p>
        </div>
      </section>

      <HowItWorks id="about-steps" title="How it works" steps={ABOUT_STEPS} />

      <section className="page-section" aria-labelledby="checklist-title">
        <div className="container">
          <h2 id="checklist-title" className="section-title">Responsible adoption checklist</h2>
          <p className="section-intro">Before you apply, make sure you are ready for:</p>
          <ul className="checklist-grid">
            {CHECKLIST.map((item) => (
              <li key={item.title} className="card checklist-item">
                <span className="step-icon" aria-hidden="true">{item.icon}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="page-section" aria-labelledby="faq-title">
        <div className="container faq">
          <h2 id="faq-title" className="section-title">Frequently asked questions</h2>
          {FAQS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={faq.question} className={isOpen ? 'faq-item open' : 'faq-item'}>
                <h3>
                  <button
                    type="button"
                    className="faq-question"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    onClick={() => toggleFaq(index)}
                  >
                    {faq.question}
                    <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                </h3>
                <div id={`faq-answer-${index}`} className="faq-answer" hidden={!isOpen}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
