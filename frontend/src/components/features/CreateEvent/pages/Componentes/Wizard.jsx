import "../CreateEvent.css"

export const Wizard = ({ step, label, active }) => {
  return (
    <div className={`wizard ${active ? "active" : ""}`}>
      <div className={`wizard-circle ${active ? "active" : ""}`}>{step}</div>
      <div className={`wizard-label ${active ? "active" : ""}`}>{label}</div>
    </div>
  );
}