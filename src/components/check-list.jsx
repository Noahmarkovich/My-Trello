import { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { boardService } from '../services/board.service';
import { saveActivity, saveChecklist } from '../store/board.actions';

export function CheckList({ board, currTask, setSidebarAction, currGroup, setActiveBoard, user }) {
  const [checklistToEdit, setChecklistToEdit] = useState(boardService.getEmptyChecklist());
  // const [taskToEdit, setTaskToEdit] = useState(currTask);

  function handleChange({ target }) {
    const { value, name: field } = target;
    setChecklistToEdit((prevChecklist) => ({ ...prevChecklist, [field]: value }));
  }

  async function onAddChecklist(ev) {
    ev.preventDefault();
    try {
      await saveChecklist(checklistToEdit, currTask, currGroup, board._id);
      const activity = {
        ['txt']: `added ${checklistToEdit.title} to this card`,
        ['task']: { id: currTask.id, title: currTask.title },
        ['byMember']: { _id: user._id, fullName: user.fullName, avatar: user.avatar }
      };
      const updatedBoard = await saveActivity(activity, board._id);
      setActiveBoard(updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className="check-list">
      <div className="checklist-header">
        <h2>Add checklist</h2>
        <button onClick={() => setSidebarAction(null)} className="exit-btn-clean">
          <GrClose className="exit" />
        </button>
      </div>

      <main className="checklist-main">
        <h1>Title</h1>
        <form onSubmit={(ev) => onAddChecklist(ev)}>
          <input
            className="checklist-input"
            type="text"
            name="title"
            value={checklistToEdit.title}
            onChange={handleChange}
            placeholder="Checklist"
          />
          <button>Add</button>
        </form>
      </main>
    </section>
  );
}
