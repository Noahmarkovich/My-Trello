export function TaskDueDate({ currTask, handleDueDateChange }) {
  return (
    <section className="task-due-date">
      <h2 className="due-date-header">Due date</h2>
      <div className="btn-container">
        <input
          type="checkbox"
          className="checkbox"
          onChange={handleDueDateChange}
          checked={currTask?.isComplete && currTask?.isComplete}
        />
        <button className="gray-btn date-btn">
          <span>
            {new Date(currTask.dueDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric'
            })}
          </span>
          at
          <span>
            {new Date(currTask.dueDate).toLocaleTimeString('en-GB', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </span>
          {currTask.isComplete && <span className="complete-tag">complete</span>}
        </button>
      </div>
    </section>
  );
}
