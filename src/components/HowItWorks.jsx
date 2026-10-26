// HowItWorks: numbered steps of the adoption process.
// Props: title, intro, steps (array of { icon, title, text }), and an optional id for scrolling.
export default function HowItWorks({ id, title, intro, steps }) {
  return (
    <section id={id} className="page-section steps-section" aria-labelledby={`${id || 'steps'}-title`}>
      <div className="container">
        <h2 id={`${id || 'steps'}-title`} className="section-title">{title}</h2>
        {intro && <p className="section-intro">{intro}</p>}
        <ol className="steps-grid">
          {steps.map((step, index) => (
            <li key={step.title} className="step-card">
              <span className="step-number" aria-hidden="true">{index + 1}</span>
              <span className="step-icon" aria-hidden="true">{step.icon}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
