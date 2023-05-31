import { useEffect, useState } from 'react';
import { HiOutlineStar } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { BoardList } from '../components/board-list.jsx';
import { AddAnotherListButton } from '../components/board/add-another-list-button.jsx';
import { GroupEdit } from '../components/group-edit.jsx';
import { loadBoard, removeGroup, updateBoard } from '../store/board.actions.js';

export function BoardPage() {
  const boards = useSelector((storeState) => storeState.boardModule.boards);
  const activeBoard = boards[0];
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [currBoard, setCurrBoard] = useState(boards[0]);
  const { boardId } = useParams();
  useEffect(() => {
    loadBoard();
  }, []);

  async function onRemoveGroup(ev, groupId) {
    ev.stopPropagation();

    try {
      await removeGroup(groupId, boardId);
    } catch (err) {
      console.log(err);
    }
  }

  async function onMarkStarred() {
    try {
      const isStarred = activeBoard.isStarred;
      // await markStarred(!isStarred, boardId);
      await updateBoard('isStarred', !isStarred, boardId);
    } catch (err) {
      console.log(err);
    }
  }

  if (!boards || boards.length === 0) {
    return <div>loading</div>;
  }

  function handleChange({ target }) {
    const { value, name: field } = target;
    setCurrBoard((prevBoard) => ({ ...prevBoard, [field]: value }));
  }

  async function onUpdateTitle(ev) {
    ev.preventDefault();
    try {
      const updatedTitle = currBoard.title;
      await updateBoard('title', updatedTitle, boardId);
    } catch (err) {
      console.log(err);
    }
  }

  if (!activeBoard) {
    return <div>loading</div>;
  }

  return (
    <div className="board-index">
      <div className="board-header">
        <form onSubmit={(ev) => onUpdateTitle(ev)}>
          <input
            className="board-title"
            type="text"
            name="title"
            placeholder={currBoard.title}
            value={currBoard.title}
            onChange={handleChange}
            style={{ width: currBoard.title.length * 11 + 'px' }}
          />
        </form>
        <button onClick={onMarkStarred} className="clean-btn">
          <HiOutlineStar className={activeBoard.isStarred ? 'star-icon full' : 'star-icon'} />
        </button>
      </div>
      <main className="board-content">
        <BoardList
          onRemoveGroup={onRemoveGroup}
          groups={activeBoard.groups}
          boardId={boardId}
          setIsNewGroupOpen={setIsNewGroupOpen}
          board={activeBoard}
        />
        {!isNewGroupOpen && (
          <AddAnotherListButton
            onClick={() => {
              setIsNewGroupOpen(true);
            }}
          />
        )}
        {isNewGroupOpen && (
          <GroupEdit
            setIsNewGroupOpen={setIsNewGroupOpen}
            boardId={boardId}
            group={null}
            onClose={() => setIsNewGroupOpen(false)}
          />
        )}
        <Outlet />
      </main>
    </div>
  );
}
