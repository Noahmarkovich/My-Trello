import { useState } from 'react';
import { RxActivityLog } from 'react-icons/rx';

export function TaskActivity({ board, taskId }) {
  const [isOnHide, setIsOnHide] = useState(false);

  return (
    <section className="task-activity">
      <div className="activity-title">
        <RxActivityLog className="activity-icon" />
        <div className="flex justify-space-between align-center full-width">
          <div>Activity</div>
          <button onClick={() => setIsOnHide(!isOnHide)} className="gray-btn">
            {isOnHide ? 'Show details' : 'Hide details'}
          </button>
        </div>
      </div>
      {!isOnHide && (
        <ul>
          {board.activities.map((activity) => {
            if (activity.task.id === taskId) {
              return (
                <li className="activity-container" key={activity.id}>
                  <div className="activity-avatar"></div>
                  <div className="activity-txt-container">
                    <span className="bold-name">Noah Markovich</span>
                    {activity.txt}
                    {activity.createdAt && (
                      <div className="created-at">
                        {new Date(activity.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}
                        <span>at</span>
                        {new Date(activity.createdAt).toLocaleTimeString('en-GB', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: false
                        })}
                      </div>
                    )}
                  </div>
                </li>
              );
            }
          })}
        </ul>
      )}
    </section>
  );
}
