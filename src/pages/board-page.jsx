import { useEffect, useState } from 'react';
import { HiOutlineStar } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { BoardList } from '../components/board-list.jsx';
import { AddAnotherListButton } from '../components/board/add-another-list-button.jsx';
import { GroupEdit } from '../components/group-edit.jsx';
import { boardService } from '../services/board.service.js';
import { loadBoards, removeGroup, updateBoard } from '../store/board.actions.js';

export function BoardPage() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const boards = useSelector((storeState) => storeState.boardModule.boards);
  const { boardId } = useParams();
  const [activeBoard, setActiveBoard] = useState(null);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  // const [currBoard, setCurrBoard] = useState(null);

  useEffect(() => {
    loadBoards();
    loadCurrBoard();
  }, []);

  async function loadCurrBoard() {
    try {
      const currBoard = await boardService.getById(boardId);
      setActiveBoard(currBoard);
    } catch (err) {
      console.log(err);
    }
  }

  async function onRemoveGroup(ev, groupId) {
    ev.stopPropagation();

    try {
      const updatedBoard = await removeGroup(groupId, boardId);
      setActiveBoard(updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }

  async function onMarkStarred() {
    try {
      const isStarred = activeBoard.isStarred;
      // await markStarred(!isStarred, boardId);
      const board = await updateBoard('isStarred', !isStarred, boardId);
      setActiveBoard(board);
    } catch (err) {
      console.log(err);
    }
  }

  if (!boards || boards.length === 0) {
    return <div>loading</div>;
  }

  function handleChange({ target }) {
    const { value, name: field } = target;
    setActiveBoard((prevBoard) => ({ ...prevBoard, [field]: value }));
  }

  async function onUpdateTitle(ev) {
    ev.preventDefault();
    try {
      const updatedTitle = activeBoard.title;
      await updateBoard('title', updatedTitle, boardId);
    } catch (err) {
      console.log(err);
    }
  }

  if (!activeBoard) {
    return <div>loading</div>;
  }

  return (
    <div
      style={{
        backgroundImage: activeBoard.style.background
      }}
      className="board-index">
      <div className="board-header">
        <form onSubmit={(ev) => onUpdateTitle(ev)}>
          <input
            className="board-title"
            type="text"
            name="title"
            placeholder={activeBoard.title}
            value={activeBoard.title}
            onChange={handleChange}
            style={{ width: activeBoard.title.length * 13 + 'px' }}
          />
        </form>
        <button onClick={onMarkStarred} className="clean-btn star">
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
          setActiveBoard={setActiveBoard}
          user={user}
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
            setActiveBoard={setActiveBoard}
          />
        )}
        <Outlet context={[setActiveBoard]} />
      </main>
    </div>
  );
}
