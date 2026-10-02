// Data dell'evento (formato ISO)
const EVENT_DATE = "2027-10-10T07:00:00";

function updateStatus() {
  const el = document.querySelector(".status");
  if (!el) return;

  const now = new Date();
  const start = new Date(EVENT_DATE);
  const end = new Date(EVENT_DATE);
  end.setHours(17, 0, 0, 0);

  el.classList.remove("status--programmata", "status--in-corso", "status--conclusa");

  if (now < start) {
    el.textContent = "Programmata";
    el.classList.add("status--programmata");
  } else if (now >= start && now <= end) {
    el.textContent = "In corso";
    el.classList.add("status--in-corso");
  } else {
    el.textContent = "Conclusa";
    el.classList.add("status--conclusa");
  }
}

updateStatus();