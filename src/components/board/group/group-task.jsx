import { useState } from 'react';
import { MdOutlineModeEditOutline } from 'react-icons/md';
import { TaskEdit } from '../../task-edit';
import paragraph from '../../../assets/img/paragraph.svg';

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
  onLabelClick
}) {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div onClick={onClick} className="task" key={task.id}>
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
      {task.description && <img className="icon description-img" src={paragraph} />}
    </div>
  );
}
