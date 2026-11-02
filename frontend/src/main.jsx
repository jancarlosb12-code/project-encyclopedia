import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const totalDaysInMonth = 31;
const monthLabel = 'October 2026';

function App() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [calendarData, setCalendarData] = useState({});
  const [statusMessage, setStatusMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDateData = async (dateStr) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/items/${dateStr}`);
      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setCalendarData((prev) => ({ ...prev, [dateStr]: data }));
    } catch (error) {
      console.error('Error fetching date data:', error);
    }
  };

  const handleOpenDatePanel = (day) => {
    const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setStatusMessage('');
    setInputValue('');
    fetchDateData(dateStr);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedDate || !inputValue.trim()) {
      setStatusMessage('Please enter a value before saving.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, content: inputValue })
      });

      if (!response.ok) {
        throw new Error('Save failed');
      }

      setStatusMessage('Saved!');
      setInputValue('');
      await fetchDateData(selectedDate);
    } catch (error) {
      console.error('Error saving data:', error);
      setStatusMessage('Error connecting to the API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialDates = Array.from({ length: totalDaysInMonth }, (_, index) => {
      const day = index + 1;
      const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
      fetchDateData(dateStr);
    });

    Promise.all(initialDates).catch(() => {});
  }, []);

  return (
    <div className="page-shell">
      <header className="header">
        <div>
          <p className="eyebrow">Project Encyclopedia Demo</p>
          <h1>{monthLabel}</h1>
        </div>
      </header>

      <div className="calendar-grid">
        {Array.from({ length: totalDaysInMonth }, (_, index) => {
          const day = index + 1;
          const dateStr = `2026-10-${String(day).padStart(2, '0')}`;
          const hasNotes = (calendarData[dateStr] || []).length > 0;

          return (
            <div
              key={day}
              className={`day-card ${selectedDate === dateStr ? 'selected' : ''}`}
            >
              <div className="day-header">
                <span className="day-number">{day}</span>
                {hasNotes && <span className="has-notes">Has info</span>}
              </div>

              <button onClick={() => handleOpenDatePanel(day)} className="manage-button">
                Manage
              </button>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <section className="panel">
          <h3>Managing information for: {selectedDate}</h3>

          <form onSubmit={handleSubmit} className="entry-form">
            <input
              type="text"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="Add project notes for this day..."
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save info'}
            </button>
          </form>

          {statusMessage && <p className="status">{statusMessage}</p>}

          <h4>Saved items for this day</h4>
          <ul className="item-list">
            {(calendarData[selectedDate] || []).map((item) => (
              <li key={item.id || item.createdAt}>{item.content}</li>
            ))}
          </ul>

          <button className="close-button" onClick={() => setSelectedDate(null)}>
            Close panel
          </button>
        </section>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
