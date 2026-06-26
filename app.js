const STORAGE_KEY = 'calEvents';

let currentYear;
let currentMonth;
let events = [];
let editingId = null;

const todayISO = (() => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
})();

// ── Persistence ───────────────────────────────────────

function loadEvents() {
  try {
    events = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (_) {
    events = [];
  }
}

function saveEvents() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

// ── Rendering ─────────────────────────────────────────

function renderCalendar() {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  document.getElementById('month-label').textContent =
    `${monthNames[currentMonth]} ${currentYear}`;

  const calendar = document.getElementById('calendar');

  // Remove old day cells (keep the 7 day-header cells)
  const existing = calendar.querySelectorAll('.day-cell, .empty-cell');
  existing.forEach(el => el.remove());

  const firstDow = new Date(currentYear, currentMonth, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const totalCells = 42;

  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - firstDow + 1;
    const cell = document.createElement('div');

    if (dayNum < 1 || dayNum > daysInMonth) {
      cell.className = 'day-cell other-month';
      // Show neighbouring month day numbers for visual continuity
      if (dayNum < 1) {
        const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
        const num = document.createElement('span');
        num.className = 'day-number';
        num.textContent = prevMonthDays + dayNum;
        cell.appendChild(num);
      } else {
        const num = document.createElement('span');
        num.className = 'day-number';
        num.textContent = dayNum - daysInMonth;
        cell.appendChild(num);
      }
      calendar.appendChild(cell);
      continue;
    }

    const isoDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    cell.className = 'day-cell';
    cell.dataset.date = isoDate;
    if (isoDate === todayISO) cell.classList.add('today');

    const num = document.createElement('span');
    num.className = 'day-number';
    num.textContent = dayNum;
    cell.appendChild(num);

    const container = document.createElement('div');
    container.className = 'events-container';

    const dayEvents = events
      .filter(e => e.date === isoDate)
      .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

    dayEvents.forEach(ev => {
      const chip = document.createElement('div');
      chip.className = 'event-chip';
      chip.dataset.id = ev.id;
      chip.textContent = ev.startTime ? `${ev.startTime} ${ev.title}` : ev.title;
      chip.title = ev.title;
      container.appendChild(chip);
    });

    cell.appendChild(container);
    calendar.appendChild(cell);
  }
}

// ── Modal ─────────────────────────────────────────────

function openModal(date, eventId) {
  editingId = eventId || null;

  const overlay = document.getElementById('modal-overlay');
  const titleEl = document.getElementById('modal-title');
  const deleteBtn = document.getElementById('delete-btn');
  const errorEl = document.getElementById('form-error');

  errorEl.textContent = '';
  errorEl.classList.add('hidden');

  if (editingId) {
    const ev = events.find(e => e.id === editingId);
    titleEl.textContent = 'Edit Event';
    document.getElementById('f-title').value = ev.title;
    document.getElementById('f-date').value = ev.date;
    document.getElementById('f-start').value = ev.startTime || '';
    document.getElementById('f-end').value = ev.endTime || '';
    document.getElementById('f-notes').value = ev.notes || '';
    deleteBtn.classList.remove('hidden');
  } else {
    titleEl.textContent = 'Add Event';
    document.getElementById('event-form').reset();
    document.getElementById('f-date').value = date || todayISO;
    deleteBtn.classList.add('hidden');
  }

  overlay.classList.remove('hidden');
  document.getElementById('f-title').focus();
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
  document.getElementById('event-form').reset();
  editingId = null;
}

// ── Event handlers ────────────────────────────────────

function handleSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('f-title').value.trim();
  const date = document.getElementById('f-date').value;
  const startTime = document.getElementById('f-start').value;
  const endTime = document.getElementById('f-end').value;
  const notes = document.getElementById('f-notes').value.trim();
  const errorEl = document.getElementById('form-error');

  errorEl.classList.add('hidden');

  if (!title) {
    errorEl.textContent = 'Title is required.';
    errorEl.classList.remove('hidden');
    document.getElementById('f-title').focus();
    return;
  }

  if (!date) {
    errorEl.textContent = 'Date is required.';
    errorEl.classList.remove('hidden');
    return;
  }

  if (startTime && endTime && endTime <= startTime) {
    errorEl.textContent = 'End time must be after start time.';
    errorEl.classList.remove('hidden');
    return;
  }

  if (editingId) {
    const ev = events.find(e => e.id === editingId);
    ev.title = title;
    ev.date = date;
    ev.startTime = startTime;
    ev.endTime = endTime;
    ev.notes = notes;
  } else {
    events.push({
      id: (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()),
      title,
      date,
      startTime,
      endTime,
      notes
    });
  }

  saveEvents();
  renderCalendar();
  closeModal();
}

function handleDelete() {
  if (!editingId) return;
  events = events.filter(e => e.id !== editingId);
  saveEvents();
  renderCalendar();
  closeModal();
}

function handleCalendarClick(e) {
  const chip = e.target.closest('.event-chip');
  if (chip) {
    e.stopPropagation();
    const cell = chip.closest('.day-cell');
    openModal(cell ? cell.dataset.date : todayISO, chip.dataset.id);
    return;
  }
  const cell = e.target.closest('.day-cell');
  if (cell && cell.dataset.date) {
    openModal(cell.dataset.date);
  }
}

// ── Init ──────────────────────────────────────────────

function init() {
  const now = new Date();
  currentYear = now.getFullYear();
  currentMonth = now.getMonth();

  loadEvents();
  renderCalendar();

  document.getElementById('prev-btn').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) { currentMonth = 11; currentYear--; }
    renderCalendar();
  });

  document.getElementById('next-btn').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) { currentMonth = 0; currentYear++; }
    renderCalendar();
  });

  document.getElementById('add-btn').addEventListener('click', () => openModal(todayISO));

  document.getElementById('modal-overlay').addEventListener('click', e => {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
  });

  document.getElementById('cancel-btn').addEventListener('click', closeModal);
  document.getElementById('event-form').addEventListener('submit', handleSubmit);
  document.getElementById('delete-btn').addEventListener('click', handleDelete);
  document.getElementById('calendar').addEventListener('click', handleCalendarClick);
}

init();
