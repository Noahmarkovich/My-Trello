import { useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { removeTask, switchPlace } from '../store/board.actions';
import { GroupPreviewTitle } from './board/group/group-preview-title';
import { GroupTask } from './board/group/group-task';
import { TaskEdit } from './task-edit';

export function BoardList({ onRemoveGroup, groups, boardId, board, setActiveBoard, user }) {
  const navigate = useNavigate();
  const [newTaskGroupId, setNewTaskGroupId] = useState(null);
  const [, setTaskId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenSmallLabel, setIsOpenSmallLabel] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragTask = useRef();
  const dragNode = useRef();
  const menuRef = useRef(null);
  useOnClickOutside(menuRef, () => closeActionMenu());

  function openAdd(groupId) {
    setIsMenuOpen(false);
    setNewTaskGroupId(groupId);
  }

  function openActionMenu(groupId) {
    newTaskGroupId === groupId ? setNewTaskGroupId(null) : setNewTaskGroupId(groupId);
    setIsMenuOpen(!isMenuOpen);
  }
  function closeActionMenu() {
    setNewTaskGroupId(null);
    setIsMenuOpen(false);
  }

  async function onRemoveTask(taskId, groupId, boardId) {
    try {
      const updatedBoard = await removeTask(taskId, groupId, boardId);
      setActiveBoard(updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }
  function openPreview(ev, taskId, groupId) {
    ev.stopPropagation();
    navigate(`/board/${boardId}/${groupId}/${taskId}`);
  }

  function handelDragStart(ev, params) {
    dragTask.current = params;
    dragNode.current = ev.target;
    dragNode.current.addEventListener('dragend', handelDragEnd);
    setTimeout(() => {
      setIsDragging(true);
    }, 0);
  }
  function handelDragEnd() {
    setIsDragging(false);
    dragNode.current.removeEventListener('dragend', handelDragEnd);
    dragTask.current = null;
    dragNode.current = null;
  }

  async function handelDragEnter(ev, params) {
    if (ev.target !== dragNode.current) {
      try {
        const updatedBoard = await switchPlace(
          params.taskIdx,
          params.groupIdx,
          dragTask.current,
          boardId
        );
        setActiveBoard(updatedBoard);
        dragTask.current = params;
      } catch (err) {
        console.log(err);
      }
    }
  }

  function getStyles(params) {
    const currTask = dragTask.current;
    if (currTask.groupIdx === params.groupIdx && currTask.taskIdx === params.taskIdx) {
      return 'current-drag task';
    }

    return 'task';
  }

  return (
    <div className="board-list">
      {groups.map((group, groupIdx) => (
        <div className="group-preview" key={group.id}>
          <GroupPreviewTitle
            boardId={boardId}
            group={group}
            openActionMenu={openActionMenu}
            setActiveBoard={setActiveBoard}
          />
          {group.tasks.map((task, taskIdx) => (
            <GroupTask
              key={task.id}
              onDragStart={(ev) => handelDragStart(ev, { groupIdx, taskIdx })}
              // onDragEnd={handelDragEnd}
              onDragEnter={isDragging ? (ev) => handelDragEnter(ev, { groupIdx, taskIdx }) : null}
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
              labels={task?.labelIds
                ?.map((labelId) => board.labels.find((label) => label.id === labelId))
                .filter((label) => !!label)}
              checkClassName={isDragging ? getStyles({ groupIdx, taskIdx }) : 'task'}
              setActiveBoard={setActiveBoard}
            />
          ))}
          {newTaskGroupId === group.id && !isMenuOpen ? (
            <TaskEdit
              setNewTaskGroupId={setNewTaskGroupId}
              setTaskId={setTaskId}
              group={group}
              boardId={boardId}
              task={null}
              onRemoveTask={onRemoveTask}
              setActiveBoard={setActiveBoard}
              user={user}
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
            <div ref={menuRef} className="actions-menu">
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
