/* ============================================
   RENAI 2026 – Script comune a tutte le pagine
   ============================================ */

// Data dell'evento (formato ISO)
const EVENT_DATE = "2026-10-10T07:00:00";


/* ============================
   1) STATO EVENTO (badge header)
   ============================ */
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


/* ============================
   2) EVIDENZIA SLOT IN CORSO
   ============================ */
function timeToMinutes(hhmm) {
  if (!hhmm) return NaN;
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

    // Se mancano gli attributi data-start/data-end, salta
    if (isNaN(start) || isNaN(end)) return;

    slot.classList.remove("slot--now", "slot--past");

    if (nowMin >= start && nowMin < end) {
      slot.classList.add("slot--now");
    } else if (nowMin >= end) {
      slot.classList.add("slot--past");
    }
  });
}


/* ============================
   3) OSSERVA CAMBI DOM (per pagine con select)
   ============================ */
function observeSlotChanges() {
  const main = document.querySelector(".app-main") || document.body;
  if (!main) return;

  const observer = new MutationObserver(() => {
    // Rilancia l'evidenziazione ogni volta che i nodi cambiano
    highlightCurrentSlot();
  });

  observer.observe(main, { childList: true, subtree: true });
}


/* ============================
   4) INIZIALIZZAZIONE
   ============================ */
updateStatus();
highlightCurrentSlot();
observeSlotChanges();

// Aggiorna ogni minuto lo stato e l'evidenziazione
setInterval(() => {
  updateStatus();
  highlightCurrentSlot();
}, 60000);

// Esponi globalmente per poter chiamare manualmente da altre pagine
window.highlightCurrentSlot = highlightCurrentSlot;
window.updateStatus = updateStatus;
