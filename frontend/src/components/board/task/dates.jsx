import { GrClose } from 'react-icons/gr';
import Calendar from 'react-calendar';
import { useRef, useState } from 'react';
import { useOnClickOutside } from '../../../hooks/useOnClickOutside';
export function Dates({ currTask, setSidebarAction, addDueDate, removeChecked, style }) {
  const [value, onChange] = useState(currTask.dueDate ? new Date(currTask.dueDate) : new Date());

  const hour = useRef(value.getHours());
  const minutes = useRef(value.getMinutes());
  const [time, setTime] = useState(hour.current + ':' + minutes.current);
  const actionRef = useRef(null);
  useOnClickOutside(actionRef, () => setSidebarAction(null));

  function handleChange({ target }) {
    const { value } = target;
    setTime(value);
  }

  return (
    <section ref={actionRef} style={style} className="dates">
      <div className="dates-header">
        <h2>Dates</h2>
        <button onClick={() => setSidebarAction(null)} className="exit-btn-clean">
          <GrClose className="exit" />
        </button>
      </div>
      <Calendar className="calendar" value={value} locale={'en'} onChange={onChange} />
      <div>
        <h1>Due date</h1>
        <div className="selected-view">
          <input type="checkbox" checked />
          <input
            className="date-input"
            type="text"
            value={value.toLocaleDateString()}
            name="date"
          />
          <input
            className="date-input time"
            type="time"
            value={time}
            placeholder={hour.current + ':' + minutes.current}
            name="time"
            onChange={handleChange}
          />
        </div>
        <button onClick={() => addDueDate(value)} className="date-btn save">
          Save
        </button>
        <button
          onClick={() => {
            addDueDate(null);
            removeChecked(false);
          }}
          className="date-btn remove">
          Remove
        </button>
      </div>
    </section>
  );
}
