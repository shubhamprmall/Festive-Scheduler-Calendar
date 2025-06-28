document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const filterEl = document.getElementById('filterInput');

  const festivals = [
    { title: "New Year's Day", date: '2025-01-01', color: '#FF4500' },
    { title: "Diwali", date: '2025-11-05', color: '#FFD700' },
    { title: "Christmas", date: '2025-12-25', color: '#008000' },
    { title: "Holi", date: '2025-03-10', color: '#FF1493' }
  ];

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    editable: true,
    selectable: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: loadEvents().concat(festivals),
    dateClick: info => {
      const title = prompt('Enter event name:');
      if (title) addEvent({ title, start: info.dateStr, color: '#3788d8' });
    },
    eventClick: info => {
      if (festivals.some(f => f.date === info.event.startStr)) {
        alert(`🎉 Festival: ${info.event.title}`);
      } else {
        const action = prompt(`Edit title or type DELETE to remove:\n("${info.event.title}")`);
        if (action === null) return;
        if (action.trim().toUpperCase() === 'DELETE') {
          info.event.remove();
          saveEvents();
        } else if (action.trim()) {
          info.event.setProp('title', action.trim());
          saveEvents();
        }
      }
    },
    eventDrop: saveEvents,
    eventResize: saveEvents,
    eventDidMount: info => {
      if (festivals.some(f => f.date === info.event.startStr)) {
        info.el.style.fontWeight = 'bold';
      }
    }
  });

  calendar.render();

  filterEl.addEventListener('input', () => {
    const q = filterEl.value.toLowerCase();
    calendar.getEvents().forEach(ev => {
      const vis = ev.title.toLowerCase().includes(q);
      if (!festivals.some(f => f.date === ev.startStr)) {
        ev.setProp('display', vis ? '' : 'none');
      }
    });
  });

  function loadEvents() {
    try {
      return JSON.parse(localStorage.getItem('myCalendarEvents')) || [];
    } catch {
      return [];
    }
  }

  function saveEvents() {
    const userEvents = calendar.getEvents()
      .filter(ev => !festivals.some(f => f.date === ev.startStr))
      .map(ev => ({
        id: ev.id,
        title: ev.title,
        start: ev.startStr,
        end: ev.endStr,
        backgroundColor: ev.backgroundColor
      }));
    localStorage.setItem('myCalendarEvents', JSON.stringify(userEvents));
  }

  function addEvent(evt) {
    calendar.addEvent(evt);
    saveEvents();
  }
});
