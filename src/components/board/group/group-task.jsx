import { useState } from 'react';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { TaskEdit } from '../../task-edit';
import paragraph from '../../../assets/img/paragraph.svg';
import { TbCheckbox } from 'react-icons/tb';
import { FaRegClock } from 'react-icons/fa';

export function GroupTask({
  task,
  boardId,
  onClick,
  setNewTaskGroupId,
  setTaskId,
  group,
  onRemoveTask,
  labels,
  shouldExpandLabel,
  onLabelClick,
  onDragStart,
  onDragEnter,
  checkClassName,
  setActiveBoard
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  function checkIfDone() {
    const countDone = task.checklists.map((checklist) =>
      checklist.todos.reduce(
        (acc, todo) => {
          if (todo.isDone) {
            const done = acc.done + 1;
            const total = acc.total + 1;

            return { ...acc, done, total };
          } else {
            const total = acc.total + 1;

            return { ...acc, total };
          }
        },
        {
          done: 0,
          total: 0
        }
      )
    );

    return countDone;
  }

  function checkIfTodos(task) {
    if (task.checklists && task.checklists.length > 0) {
      //   task.checklists.map((checklist) => {
      //     return checklist.todos;
      //   });
      return task.checklists.map((checklist) => checklist.todos.length > 0);
    }
  }

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onClick={onClick}
      className={checkClassName}
      key={task.id}>
      {labels && (
        <div className="small-labels">
          {labels.map((label) => {
            return (
              <button
                key={label.id}
                onClick={onLabelClick}
                style={
                  shouldExpandLabel
                    ? { backgroundColor: `${label.colorLight}` }
                    : { backgroundColor: `${label.colorDark}` }
                }
                className={`small-label ${shouldExpandLabel && 'open-small-label'}`}>
                <div
                  className="inner-color"
                  style={{ backgroundColor: `${label.colorDark}` }}></div>
                {label.title}
              </button>
            );
          })}
        </div>
      )}
      {isEditMode ? (
        <TaskEdit
          setNewTaskGroupId={setNewTaskGroupId}
          setTaskId={setTaskId}
          groupId={group.id}
          boardId={boardId}
          task={task}
          onRemoveTask={onRemoveTask}
          setActiveBoard={setActiveBoard}
        />
      ) : (
        <span className="task-title">{task.title}</span>
      )}
      <button
        onClick={(ev) => {
          ev.stopPropagation();
          setIsEditMode(true);
        }}
        className="edit">
        <MdOutlineModeEditOutline />
      </button>
      <div className="group-icons">
        {task.dueDate && (
          <div className={task.isComplete ? 'checklist-preview complete' : 'checklist-preview'}>
            <FaRegClock />
            <span>
              {new Date(task.dueDate).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        )}
        {task.description && <img className="icon description-img" src={paragraph} />}
        {checkIfTodos(task) && (
          <div
            className={
              checkIfDone()[0].done === checkIfDone()[0].total && checkIfDone()[0].done !== 0
                ? 'checklist-preview complete'
                : 'checklist-preview'
            }>
            <TbCheckbox className="checklist-icon" />
            <span>{checkIfDone()[0].done + '/' + checkIfDone()[0].total}</span>
          </div>
        )}
      </div>
    </div>
  );
}
