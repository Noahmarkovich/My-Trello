import { useRef, useState } from 'react';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { removeTask, switchPlace } from '../../store/board.actions';
import { GroupPreviewTitle } from './group/group-preview-title';
import { GroupTask } from './group/group-task';
import { TaskEdit } from './task/task-edit';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

export function BoardList({ onRemoveGroup, groups, boardId, board, setActiveBoard, user }) {
  const navigate = useNavigate();
  const [newTaskGroupId, setNewTaskGroupId] = useState(null);
  const [, setTaskId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isOpenSmallLabel, setIsOpenSmallLabel] = useState(false);

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

  async function handleDragEnd({ destination, source, type }) {
    if (!destination) {
      return;
    }
    if (type !== 'group') {
      return;
    }
    try {
      const updatedBoard = await switchPlace(
        source.index,
        source.droppableId,
        destination,
        boardId
      );
      setActiveBoard(updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="board-list">
      <DragDropContext onDragEnd={handleDragEnd}>
        {groups.map((group, groupIdx) => (
          <div className="preview-container" key={groupIdx}>
            <div className="group-preview" key={group.id}>
              <GroupPreviewTitle
                boardId={boardId}
                group={group}
                openActionMenu={openActionMenu}
                setActiveBoard={setActiveBoard}
              />
              <Droppable droppableId={group.id} type="group">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="group-scroll">
                    {group.tasks.map((task, taskIdx) => (
                      <GroupTask
                        key={task.id}
                        taskIdx={taskIdx}
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
                        setActiveBoard={setActiveBoard}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
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
            </div>
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
      </DragDropContext>
    </div>
  );
}
