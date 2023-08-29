import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { addTask, saveLabel } from '../store/board.actions';
import { Label } from './label';

import { GrClose } from 'react-icons/gr';
import { MdArrowBackIosNew } from 'react-icons/md';
import edit from '../assets/img/edit.svg';
import { CreateLabel } from './create-label';
import { boardService } from '../services/board.service';
import { useOnClickOutside } from '../hooks/useOnClickOutside';

export function Labels({ board, currTask, setSidebarAction, setActiveBoard, style }) {
  const [taskToEdit, setTaskToEdit] = useState(currTask);
  const { groupId } = useParams();
  const [isCreateLabel, setIsCreateLabel] = useState(false);
  const [currLabel, setCurrLabel] = useState(null);
  const actionRef = useRef(null);
  useOnClickOutside(actionRef, () => setSidebarAction(null));

  useEffect(() => {
    onMarkLabel();
  }, [taskToEdit]);

  async function onMarkLabel() {
    try {
      const updatedBoard = await addTask(taskToEdit, groupId, board._id);
      setActiveBoard(updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleChange({ target }) {
    const { name: field, id } = target;

    if (taskToEdit.labelIds && taskToEdit.labelIds.includes(id)) {
      const labels = taskToEdit.labelIds.filter((labelId) => labelId !== id);
      // setTaskToEdit((prevTask)=> ({...prevTask, task}))
      setTaskToEdit((prevTask) => ({ ...prevTask, [field]: labels }));
    } else if (taskToEdit.labelIds) {
      // setTaskToEdit(taskToEdit)
      setTaskToEdit((prevTask) => ({ ...prevTask, [field]: [...prevTask.labelIds, id] }));
    } else {
      setTaskToEdit((prevTask) => ({ ...prevTask, [field]: [id] }));
    }
  }

  function handleCreateChange({ target }) {
    const { value, name: field } = target;
    setCurrLabel((prevGroup) => ({ ...prevGroup, [field]: value }));
  }

  async function onSubmitNewLabel(ev) {
    ev.preventDefault();

    try {
      const updatedBoard = await saveLabel(currLabel, board._id);
      setActiveBoard(updatedBoard);
      setIsCreateLabel(false);
      // if (taskToEdit.labelIds) {
      //   setTaskToEdit((prevTask) => ({
      //     ...prevTask,
      //     ['labelIds']: [...prevTask.labelIds, currLabel.id]
      //   }));
      // } else {
      //   setTaskToEdit((prevTask) => ({ ...prevTask, ['labelIds']: [currLabel.id] }));
      // }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section ref={actionRef} style={style} className="labels">
      <div className="labels-header">
        {isCreateLabel && (
          <button onClick={() => setIsCreateLabel(false)} className="back-btn-clean">
            <MdArrowBackIosNew className="back" />
          </button>
        )}
        <h2>{isCreateLabel ? 'Create label' : 'Labels'}</h2>
        <button onClick={() => setSidebarAction(null)} className="exit-btn-clean">
          <GrClose className="exit" />
        </button>
      </div>
      {isCreateLabel && (
        <div className="label-create-preview">{currLabel && <Label label={currLabel} />}</div>
      )}
      <main className="main-labels">
        {isCreateLabel && <h1>Title</h1>}
        <form onSubmit={(ev) => onSubmitNewLabel(ev)}>
          <input
            type="text"
            name="title"
            value={currLabel && currLabel.title}
            onChange={handleCreateChange}
            placeholder={isCreateLabel ? '' : 'Search labels...'}
          />
          {currLabel && <button>{currLabel ? 'Save' : 'Create'}</button>}
        </form>

        <h1>{isCreateLabel ? 'Select a color' : 'Labels'}</h1>

        {isCreateLabel ? (
          <ul className="create-labels">
            {/* {board.labels.map(label =>
                        <li onClick={() => setCurrLabel(label)} key={label.id} className="label-create">
                            <CreateLabel label={label} />
                        </li>)} */}
            {boardService.newLabels().map((label) => (
              <li onClick={() => setCurrLabel(label)} key={label.name} className="label-create">
                <CreateLabel label={label} />
              </li>
            ))}
          </ul>
        ) : (
          <ul>
            {board.labels.map((label) => (
              <li key={label.id} className="label">
                <input
                  onChange={handleChange}
                  name="labelIds"
                  className="label-input"
                  type="checkbox"
                  id={label.id}
                  checked={taskToEdit.labelIds && taskToEdit.labelIds.includes(label.id)}
                />

                <Label label={label} handleChange={handleChange} />
                <button
                  onClick={() => {
                    setIsCreateLabel(true);
                    setCurrLabel(label);
                  }}
                  className="clean-btn">
                  <img className="edit-icon" src={edit} />
                </button>
              </li>
            ))}
          </ul>
        )}

        <button onClick={() => setIsCreateLabel(true)} className="sidebar-btn">
          Create a new label
        </button>
      </main>
    </section>
  );
}
