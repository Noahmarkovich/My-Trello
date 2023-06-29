import { useEffect, useState } from 'react';
import { boardService } from '../services/board.service';
import x from '../assets/img/x.svg';
import { addTask, saveActivity } from '../store/board.actions';

export function TaskEdit({
  setNewTaskGroupId,
  setTaskId,
  group,
  boardId,
  task,
  onRemoveTask,
  setActiveBoard,
  closeEdit,
  user
}) {
  const [newTask, setNewTask] = useState(boardService.getEmptyTask());

  useEffect(() => {
    if (!task) {
      return;
    }
    setNewTask(task);
  }, []);

  async function onAddTask(ev) {
    ev.preventDefault();
    try {
      const savedBoard = await addTask(newTask, group.id, boardId);
      const groupIdx = savedBoard.groups.findIndex((currGroup) => currGroup.id === group.id);
      const savedTask = savedBoard.groups[groupIdx].tasks[group.tasks.length];
      const activity = {
        ['txt']: `added this card to ${group.title}`,
        ['task']: { id: savedTask.id, title: savedTask.title },
        ['byMember']: { _id: user._id, fullName: user.fullName, avatar: user.avatar }
      };
      const updatedBoard = await saveActivity(activity, boardId);
      setActiveBoard(updatedBoard);
      setNewTask(boardService.getEmptyTask());
      // setIsNewGroupOpen(false)
    } catch (err) {
      console.log(err);
    }
  }
  async function onEditTask(ev) {
    ev.preventDefault();
    try {
      const updatedBoard = await addTask(newTask, group.id, boardId);
      setActiveBoard(updatedBoard);
      setTaskId(null);
      closeEdit();
      // setNewTask(boardService.getEmptyTask())
      // setIsNewGroupOpen(false)
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange({ target }) {
    const { value, name: field } = target;
    setNewTask((prevGroup) => ({ ...prevGroup, [field]: value }));
  }

  function closeForm() {
    setNewTaskGroupId(null);
    setNewTask(boardService.getEmptyTask());
  }

  return (
    // <div className={newTask.id && 'dark-screen'}>
    <div className="task-edit">
      <form onSubmit={newTask.id ? onEditTask : onAddTask}>
        <div className="task-composer">
          <textarea
            onClick={(ev) => ev.stopPropagation()}
            type="text"
            name="title"
            value={newTask.title}
            placeholder="Enter a title for this card..."
            onChange={handleChange}
            required
          />
        </div>
        <div className="buttons-container">
          <button onClick={(ev) => ev.stopPropagation()}>{newTask.id ? 'Save' : 'Add card'}</button>
          {!newTask.id && (
            <img
              onClick={newTask.id ? () => onRemoveTask(newTask.id, group.id, boardId) : closeForm}
              className="icon delete"
              src={x}
            />
          )}
        </div>
      </form>
    </div>
    // </div>
  );
}
