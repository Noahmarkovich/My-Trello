import { useEffect, useState } from 'react';
import x from '../../../assets/img/x.svg';
import { boardService } from '../../../services/board.service';
import { addGroup } from '../../../store/board.actions';

export function GroupEdit({ boardId, group, onClose, setActiveBoard }) {
  const [newGroup, setNewGroup] = useState(boardService.getEmptyGroup());

  useEffect(() => {
    if (!group) {
      return;
    }
    setNewGroup(group);
  }, []);

  async function onAddGroup(ev) {
    ev.preventDefault();
    try {
      const updatedBoard = await addGroup(newGroup, boardId);
      setActiveBoard(updatedBoard);
      setNewGroup(boardService.getEmptyGroup());
    } catch (err) {
      console.log(err);
    }
  }
  async function onEditGroup(ev) {
    ev.preventDefault();
    try {
      const updatedBoard = await addGroup(newGroup, boardId);
      setActiveBoard(updatedBoard);
      onClose();
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange({ target }) {
    const { value, name: field } = target;
    setNewGroup((prevGroup) => ({ ...prevGroup, [field]: value }));
  }

  function closeForm() {
    onClose();
    setNewGroup(boardService.getEmptyGroup());
  }

  return (
    <div className="group-edit">
      <form
        onSubmit={(ev) => {
          group ? onEditGroup(ev) : onAddGroup(ev);
        }}>
        <input
          type="text"
          name="title"
          value={newGroup.title}
          placeholder="Enter list title..."
          onChange={handleChange}
          required
          autoFocus
        />
        {!group && (
          <div className="buttons-container">
            <button>Add list</button>
            <img onClick={closeForm} className="icon delete" src={x} />
          </div>
        )}
      </form>
    </div>
  );
}
