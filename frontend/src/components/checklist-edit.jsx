import { useEffect, useState } from 'react';
import { boardService } from '../services/board.service';
import { saveTodo } from '../store/board.actions';

export function CheckListEdit({
  taskToEdit,
  checklistIdx,
  todoId,
  setCheckListId,
  groupId,
  boardId,
  setIsEditMode
}) {
  const [todoToEdit, setTodoToEdit] = useState(boardService.getEmptyTodo());

  useEffect(() => {
    if (todoId) {
      const currTodo = taskToEdit.checklists[checklistIdx].todos.find((todo) => todo.id === todoId);
      setTodoToEdit(currTodo);
    }
  }, []);

  function handleChange({ target }) {
    const { value, name: field } = target;
    setTodoToEdit((prevTodo) => ({ ...prevTodo, [field]: value }));
  }

  async function addTodo(ev) {
    ev.preventDefault();
    if (!todoToEdit.title) {
      return;
    }
    try {
      saveTodo(todoToEdit, taskToEdit.checklists[checklistIdx], taskToEdit, groupId, boardId);
      if (!todoToEdit.id) {
        setTodoToEdit(boardService.getEmptyTodo());
      } else {
        setIsEditMode(false);
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className="checklist-edit">
      <form onSubmit={(ev) => addTodo(ev)}>
        <textarea
          type="text"
          name="title"
          placeholder="Add an item"
          value={todoToEdit.title}
          onChange={handleChange}
        />
        <div className="button-container">
          <button>{todoToEdit.id ? 'Save' : 'Add'}</button>
          <button onClick={() => setCheckListId(null)} className="cancel">
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
