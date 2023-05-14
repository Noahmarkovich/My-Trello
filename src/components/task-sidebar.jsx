import { useState } from 'react';
import { Labels } from './labels';

import { TbCheckbox } from 'react-icons/tb';
import { FaRegClock } from 'react-icons/fa';
import { CheckList } from './check-list';
import { Dates } from './dates';
import { addTask, saveActivity } from '../store/board.actions';

const SideBarActions = {
  Labels: 'labels',
  Checklist: 'check-list',
  Dates: 'dates'
};

export function TaskSideBar({ board, currTask, currGroup }) {
  const [sidebarAction, setSidebarAction] = useState(null);

  async function addDueDate(value) {
    const updatedTask = {
      ...currTask,
      dueDate: value
    };
    const activity = {
      ['txt']: `set this card to be due ${new Date(value).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric'
      })}
          `,
      ['task']: { id: currTask.id, title: currTask.title }
    };
    try {
      await addTask(updatedTask, currGroup.id, board._id);
      await saveActivity(activity, board._id);
    } catch (err) {
      console.log(err);
    }
  }

  function removeChecked(value) {
    const updatedTask = {
      ...currTask,
      isComplete: value
    };
    addTask(updatedTask, currGroup.id, board._id);
  }

  return (
    <section className="task-sidebar">
      <h1>Add to card</h1>
      <button onClick={() => setSidebarAction(SideBarActions.Labels)} className="sidebar-btn">
        <svg
          className="rotate"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          version="1.2"
          baseProfile="tiny"
          viewBox="0 0 24 24"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M9 4c1.279 0 2.559.488 3.535 1.465l3.465 3.535 5 5-7 7-5.498-5.498c-.037.033-3.037-2.967-3.037-2.967-1.953-1.953-1.953-5.119 0-7.07.976-.977 2.256-1.465 3.535-1.465m0-2c-1.87 0-3.628.729-4.949 2.051-1.322 1.32-2.051 3.078-2.051 4.948s.729 3.628 2.051 4.95l3 3c.107.107.227.201.35.279l5.187 5.186c.391.391.9.586 1.413.586s1.022-.195 1.414-.586l7-7c.78-.781.78-2.047 0-2.828l-5-5-3.45-3.521c-1.337-1.336-3.095-2.065-4.965-2.065zM9 7.498c.829 0 1.5.672 1.5 1.502s-.671 1.498-1.5 1.498-1.5-.668-1.5-1.498.671-1.502 1.5-1.502m0-1c-1.379 0-2.5 1.122-2.5 2.502 0 1.377 1.121 2.498 2.5 2.498s2.5-1.121 2.5-2.498c0-1.38-1.121-2.502-2.5-2.502z"></path>
        </svg>
        <span>Labels</span>
      </button>
      <button onClick={() => setSidebarAction(SideBarActions.Checklist)} className="sidebar-btn">
        <TbCheckbox />
        <span>Checklist</span>
      </button>
      <button onClick={() => setSidebarAction(SideBarActions.Dates)} className="sidebar-btn">
        <FaRegClock />
        <span>Dates</span>
      </button>
      {sidebarAction === SideBarActions.Labels && (
        <Labels
          board={board}
          currTask={currTask}
          // onClose={() => setSidebarAction(null)}
          setSidebarAction={setSidebarAction}
          comesFrom={'sideBar'}
        />
      )}
      {sidebarAction === SideBarActions.Checklist && (
        <CheckList
          board={board}
          currTask={currTask}
          // onClose={() => setSidebarAction(null)}
          setSidebarAction={setSidebarAction}
          currGroup={currGroup}
        />
      )}
      {sidebarAction === SideBarActions.Dates && (
        <Dates
          setSidebarAction={setSidebarAction}
          addDueDate={addDueDate}
          currTask={currTask}
          removeChecked={removeChecked}
          // onClose={() => setSidebarAction(null)}
        />
      )}
    </section>
  );
}
