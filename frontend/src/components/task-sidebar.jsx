import { useRef, useState } from 'react';
import { Labels } from './labels';

import { TbCheckbox } from 'react-icons/tb';
import { FaRegClock } from 'react-icons/fa';
import { CheckList } from './check-list';
import { Dates } from './dates';
import { addTask, saveActivity } from '../store/board.actions';
import { LabelsTag } from './svg/labels-tag';

const SideBarActions = {
  Labels: 'labels',
  Checklist: 'check-list',
  Dates: 'dates'
};

export function TaskSideBar({ board, currTask, currGroup, setActiveBoard, user }) {
  const [sidebarAction, setSidebarAction] = useState(null);
  const [sidebarActionLocation, setSidebarActionLocation] = useState();
  const labelsRef = useRef(null);
  const datesRef = useRef(null);
  const checklistRef = useRef(null);

  async function addDueDate(value) {
    setSidebarAction(null);
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
      ['task']: { id: currTask.id, title: currTask.title },
      ['byMember']: { _id: user._id, fullName: user.fullName, avatar: user.avatar }
    };
    try {
      await addTask(updatedTask, currGroup.id, board._id);
      const updatedBoard = await saveActivity(activity, board._id);
      setActiveBoard(updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }

  async function removeChecked(value) {
    const updatedTask = {
      ...currTask,
      isComplete: value
    };
    const updatedBoard = await addTask(updatedTask, currGroup.id, board._id);
    setActiveBoard(updatedBoard);
  }

  function locateSidebarMenu(ref) {
    if (ref.current) {
      const taskRect = ref.current.getBoundingClientRect();

      setSidebarActionLocation({
        top: taskRect.top,
        left: taskRect.left
      });
    }
  }

  return (
    <section className="task-sidebar">
      <h1>Add to card</h1>
      <button
        ref={labelsRef}
        onClick={() => {
          locateSidebarMenu(labelsRef);
          setSidebarAction(SideBarActions.Labels);
        }}
        className="sidebar-btn">
        <LabelsTag />
        <span>Labels</span>
      </button>
      <button
        ref={checklistRef}
        onClick={() => {
          locateSidebarMenu(checklistRef);
          setSidebarAction(SideBarActions.Checklist);
        }}
        className="sidebar-btn">
        <TbCheckbox />
        <span>Checklist</span>
      </button>
      <button
        ref={datesRef}
        onClick={() => {
          locateSidebarMenu(datesRef);
          setSidebarAction(SideBarActions.Dates);
        }}
        className="sidebar-btn">
        <FaRegClock />
        <span>Dates</span>
      </button>
      {sidebarAction === SideBarActions.Labels && (
        <Labels
          board={board}
          currTask={currTask}
          setSidebarAction={setSidebarAction}
          comesFrom={'sideBar'}
          setActiveBoard={setActiveBoard}
          style={{ top: sidebarActionLocation.top - 16 }}
        />
      )}
      {sidebarAction === SideBarActions.Checklist && (
        <CheckList
          board={board}
          currTask={currTask}
          setSidebarAction={setSidebarAction}
          currGroup={currGroup}
          setActiveBoard={setActiveBoard}
          user={user}
          style={{ top: sidebarActionLocation.top - 16 }}
        />
      )}
      {sidebarAction === SideBarActions.Dates && (
        <Dates
          setSidebarAction={setSidebarAction}
          addDueDate={addDueDate}
          currTask={currTask}
          removeChecked={removeChecked}
          setActiveBoard={setActiveBoard}
          style={{ top: sidebarActionLocation.top - 16 }}
        />
      )}
    </section>
  );
}
