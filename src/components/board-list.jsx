import { useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { removeTask } from '../store/board.actions';
import { GroupPreviewTitle } from './board/group/group-preview-title';
import { GroupTask } from './board/group/group-task';
import { TaskEdit } from './task-edit';

export function BoardList({ onRemoveGroup, groups, boardId, board }) {
  const navigate = useNavigate();
  const [newTaskGroupId, setNewTaskGroupId] = useState(null);
  const [, setTaskId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenSmallLabel, setIsOpenSmallLabel] = useState(false);

  function openAdd(groupId) {
    setIsMenuOpen(false);
    setNewTaskGroupId(groupId);
  }

  function openActionMenu(groupId) {
    newTaskGroupId === groupId ? setNewTaskGroupId(null) : setNewTaskGroupId(groupId);
    setIsMenuOpen(!isMenuOpen);
  }

  async function onRemoveTask(taskId, groupId, boardId) {
    try {
      await removeTask(taskId, groupId, boardId);
    } catch (err) {
      console.log(err);
    }
  }
  function openPreview(ev, taskId, groupId) {
    ev.stopPropagation();
    navigate(`/board/${groupId}/${taskId}`);
  }

  return (
    <div className="board-list">
      {groups.map((group) => (
        <div className="group-preview" key={group.id}>
          <GroupPreviewTitle boardId={boardId} group={group} openActionMenu={openActionMenu} />
          {group.tasks.map((task) => (
            <GroupTask
              key={task.id}
              onClick={(ev) => openPreview(ev, task.id, group.id)}
              task={task}
              boardId={boardId}
              setNewTaskGroupId={setNewTaskGroupId}
              setTaskId={setTaskId}
              board={board}
              group={group}
              onRemoveTask={onRemoveTask}
              shouldExpandLabel={isOpenSmallLabel}
              onLabelClick={(ev) => {
                ev.stopPropagation();
                setIsOpenSmallLabel(!isOpenSmallLabel);
              }}
              labels={task.labelIds
                ?.map((labelId) => board.labels.find((label) => label.id === labelId))
                .filter((label) => !!label)}
            />
          ))}
          {newTaskGroupId === group.id && !isMenuOpen ? (
            <TaskEdit
              setNewTaskGroupId={setNewTaskGroupId}
              setTaskId={setTaskId}
              groupId={group.id}
              boardId={boardId}
              task={null}
              onRemoveTask={onRemoveTask}
            />
          ) : (
            <div onClick={() => openAdd(group.id)} className="add-task">
              <span className="plus-icon">
                <FiPlus />
              </span>
              <span>Add a card</span>
            </div>
          )}
          {isMenuOpen && group.id === newTaskGroupId && (
            <div className="actions-menu">
              <div className="title">List actions</div>
              <div onClick={(ev) => onRemoveGroup(ev, group.id)} className="action">
                Delete list
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
