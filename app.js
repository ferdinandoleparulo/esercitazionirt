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
   2) EVIDENZIA SLOT/FASCE IN CORSO
   Gestisce sia .slot (programma, squadre)
   sia .fascia (isole) leggendo data-start/data-end
   ============================ */
function timeToMinutes(hhmm) {
  if (!hhmm) return NaN;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function highlightCurrentSlot() {
  const elements = document.querySelectorAll(".slot, .fascia");
  if (elements.length === 0) return;

  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();

  elements.forEach(el => {
    const start = timeToMinutes(el.dataset.start);
    const end   = timeToMinutes(el.dataset.end);

    // Se mancano data-start/data-end, salta
    if (isNaN(start) || isNaN(end)) return;

    const isFascia = el.classList.contains("fascia");
    const nowClass  = isFascia ? "fascia--now"  : "slot--now";
    const pastClass = isFascia ? "fascia--past" : "slot--past";

    el.classList.remove("slot--now", "slot--past", "fascia--now", "fascia--past");

    if (nowMin >= start && nowMin < end) {
      el.classList.add(nowClass);
    } else if (nowMin >= end) {
      el.classList.add(pastClass);
    }
  });
}


/* ============================
   3) OSSERVA CAMBI DOM
   (per pagine con select che rigenerano contenuto)
   ============================ */
function observeSlotChanges() {
  const main = document.querySelector(".app-main") || document.body;
  if (!main) return;

  const observer = new MutationObserver(() => {
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

// Aggiorna ogni minuto
setInterval(() => {
  updateStatus();
  highlightCurrentSlot();
}, 60000);

// Esponi globalmente per le pagine che ne hanno bisogno
window.highlightCurrentSlot = highlightCurrentSlot;
window.updateStatus = updateStatus;
