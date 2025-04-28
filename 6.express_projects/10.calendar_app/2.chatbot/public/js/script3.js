const calendarEl = document.getElementById('calendar');
const overlay = document.getElementById('overlay');
const modal = document.getElementById('eventModal');
const modalDate = document.getElementById('modalDate');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const displayDate = document.getElementById('displayDate');
const eventIdInput = document.getElementById('eventId');
const monthLabel = document.getElementById('calendar-month');

const today = new Date();
let currentYear = today.getFullYear();
let currentMonth = today.getMonth();

function getMonthDays(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function renderCalendar() {
    calendarEl.innerHTML = '';
    monthLabel.textContent = `${currentYear}년 ${currentMonth + 1}월`;
    const daysInMonth = getMonthDays(currentYear, currentMonth);
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const totalCells = daysInMonth + firstDay;

    for (let i = 0; i < totalCells; i++) {
        const dayEl = document.createElement('div');
        dayEl.classList.add('day');
        if (i >= firstDay) {
            const dateNum = i - firstDay + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(
                dateNum
            ).padStart(2, '0')}`;
            dayEl.innerHTML = `<div class="date">${dateNum}</div><div class="events" id="events-${dateStr}"></div>`;

            if (dateStr === today.toISOString().slice(0, 10)) {
                dayEl.classList.add('today');
            }

            dayEl.addEventListener('click', () => openModal(dateStr));

            fetch(`/events/${dateStr}`)
                .then((res) => res.json())
                .then((events) => {
                    const eventsEl = document.getElementById(`events-${dateStr}`);
                    events.forEach((ev) => {
                        const div = document.createElement('div');
                        div.textContent = ev.title;
                        div.addEventListener('click', (e) => {
                            e.stopPropagation();
                            openModal(dateStr, ev);
                        });
                        eventsEl.appendChild(div);
                    });
                });
        }
        calendarEl.appendChild(dayEl);
    }
}

function changeMonth(offset) {
    currentMonth += offset;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function openModal(date, event = null) {
    overlay.classList.add('active');
    modal.classList.add('active');
    modalDate.value = date;
    displayDate.textContent = date;
    if (event) {
        modalTitle.value = event.title;
        modalDesc.value = event.description;
        eventIdInput.value = event.id;
    } else {
        modalTitle.value = '';
        modalDesc.value = '';
        eventIdInput.value = '';
    }
}

function closeModal() {
    overlay.classList.remove('active');
    modal.classList.remove('active');
}

function saveEvent() {
    const id = eventIdInput.value;
    const date = modalDate.value;
    const title = modalTitle.value;
    const desc = modalDesc.value;
    if (!title) return alert('제목은 필수입니다.');

    const url = id ? `/events/${id}` : '/events';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, title, description: desc }),
    }).then(() => {
        closeModal();
        renderCalendar();
    });
}

function deleteEvent() {
    const id = eventIdInput.value;
    if (!id) return alert('삭제할 일정이 없습니다.');
    if (!confirm('정말 삭제하시겠습니까?')) return;

    fetch(`/events/${id}`, { method: 'DELETE' }).then(() => {
        closeModal();
        renderCalendar();
    });
}

renderCalendar();
