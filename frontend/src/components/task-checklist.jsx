import { useState } from 'react';
import { TbCheckbox } from 'react-icons/tb';
import { addTask, removeChecklist, removeTodo } from '../store/board.actions';
import { CheckListEdit } from './checklist-edit';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { BsThreeDots } from 'react-icons/bs';
import { saveActivity } from '../store/board.actions';

export function TaskChecklist({ currTask, groupId, boardId, setActiveBoard }) {
  // const [taskToEdit, setTaskToEdit] = useState(currTask);
  const [checkListId, setCheckListId] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [todoId, setTodoId] = useState(null);
  const [isActionsOpen, setIsActionsOpen] = useState(false);

  function calculatePres(checklist) {
    const numOfDone = checklist.todos.reduce((acc, todo) => (todo.isDone ? acc + 1 : acc + 0), 0);
    const percentage =
      checklist.todos.length > 0 ? Math.round((numOfDone / checklist.todos.length) * 100) : 0;

    return percentage;
  }

  async function handleChange(ev, todoIdx, checkListIdx, isDone) {
    ev.stopPropagation();
    const updatedTask = {
      ...currTask,
      checklists: currTask.checklists.map((checklist, idx) => {
        if (checkListIdx !== idx) {
          return checklist;
        }

        return {
          ...checklist,
          todos: checklist.todos.map((todo, idx) => {
            if (todoIdx !== idx) {
              return todo;
            }

            return {
              ...todo,
              isDone
            };
          })
        };
      })
    };
    let activity;
    if (updatedTask.checklists[checkListIdx].todos[todoIdx].isDone) {
      activity = {
        ['txt']: `completed ${updatedTask.checklists[checkListIdx].todos[todoIdx].title} on this card`,
        ['task']: { id: currTask.id, title: currTask.title }
      };
    } else {
      activity = {
        ['txt']: `marked ${updatedTask.checklists[checkListIdx].todos[todoIdx].title} incomplete on this card`,
        ['task']: { id: currTask.id, title: currTask.title }
      };
    }
    try {
      await addTask(updatedTask, groupId, boardId);
      const updatedBoard = await saveActivity(activity, boardId);
      setActiveBoard(updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteChecklist(checklist) {
    console.log(checklist);
    try {
      const activity = {
        ['txt']: `removed ${checklist.title} from this card`,
        ['task']: { id: currTask.id, title: currTask.title }
      };
      await saveActivity(activity, boardId);
      const updatedBoard = await removeChecklist(checklist, currTask.id, groupId, boardId);
      setActiveBoard(updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteTodo(ev, todoId, checklistId) {
    ev.stopPropagation();
    const updatedBoard = await removeTodo(todoId, checklistId, currTask.id, groupId, boardId);
    setActiveBoard(updatedBoard);
  }

  // console.log(currTask);
  return (
    <section className="task-checklist">
      {currTask.checklists.map((checklist, checkListIdx) => (
        <main key={checklist.id}>
          <div className="checklist-title">
            <TbCheckbox className="checklist-icon" />
            <div className="flex justify-space-between align-center full-width">
              <div>{checklist.title}</div>
              <button className="gray-btn" onClick={() => deleteChecklist(checklist)}>
                Delete
              </button>
            </div>
          </div>
          <div className="checklist-progress">
            <span className="percentage">{calculatePres(checklist)}%</span>
            <ProgressBar animated now={calculatePres(checklist)} variant="success" />
          </div>
          <div className="todos">
            {checklist.todos && (
              <ul>
                {checklist.todos.map((todo, todoIdx) => (
                  <li
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setIsEditMode(true);
                      setTodoId(todo.id);
                    }}
                    key={todo.id}
                    className={todo.isDone && todo.id !== todoId ? 'todo checked' : 'todo'}>
                    <div className="checkbox-container">
                      <input
                        className="todo-input"
                        name="todos"
                        type="checkbox"
                        id={todo.id}
                        onChange={(ev) => handleChange(ev, todoIdx, checkListIdx, !todo.isDone)}
                        checked={todo.isDone}
                      />
                      {isEditMode && todoId === todo.id ? (
                        <CheckListEdit
                          taskToEdit={currTask}
                          checklistIdx={checkListIdx}
                          todoId={todo.id}
                          setCheckListId={setCheckListId}
                          groupId={groupId}
                          boardId={boardId}
                          setIsEditMode={setIsEditMode}
                        />
                      ) : (
                        todo.title
                      )}
                    </div>
                    <button
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setIsActionsOpen(true);
                        setTodoId(todo.id);
                      }}
                      className="clean-btn actions">
                      <BsThreeDots />
                    </button>
                    {isActionsOpen && todoId === todo.id && (
                      <div className="actions-menu">
                        <div className="title">Item actions</div>
                        <div
                          onClick={(ev) => deleteTodo(ev, todo.id, checklist.id)}
                          className="action">
                          Delete
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {checkListId === checklist.id ? (
            <CheckListEdit
              taskToEdit={currTask}
              checklistIdx={checkListIdx}
              todoId={null}
              setCheckListId={setCheckListId}
              groupId={groupId}
              boardId={boardId}
            />
          ) : (
            <button onClick={() => setCheckListId(checklist.id)} className="gray-btn add">
              Add an item
            </button>
          )}
        </main>
      ))}
    </section>
  );
}
