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
/* ============================
   EVIDENZIA SLOT IN CORSO
   ============================ */

function timeToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function highlightCurrentSlot() {
  const slots = document.querySelectorAll(".slot");
  if (slots.length === 0) return;

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  slots.forEach(slot => {
    const start = timeToMinutes(slot.dataset.start);
    const end   = timeToMinutes(slot.dataset.end);

    slot.classList.remove("slot--now", "slot--past");

    if (nowMin >= start && nowMin < end) {
      slot.classList.add("slot--now");
    } else if (nowMin >= end) {
      slot.classList.add("slot--past");
    }
  });
}

highlightCurrentSlot();
setInterval(highlightCurrentSlot, 60000); // aggiorna ogni minuto
