import { useEffect, useState } from 'react';
import { HiOutlineStar } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import { Outlet, useParams } from 'react-router-dom';
import { BoardList } from '../components/board-list.jsx';
import { AddAnotherListButton } from '../components/board/add-another-list-button.jsx';
import { GroupEdit } from '../components/group-edit.jsx';
import { boardService } from '../services/board.service.js';
import { loadBoards, removeGroup, updateBoard } from '../store/board.actions.js';
import {
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EVENT_CHANGED_BOARD,
  socketService
} from '../services/socket.service.js';

export function BoardPage() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const boards = useSelector((storeState) => storeState.boardModule.boards);
  const { boardId } = useParams();
  const [activeBoard, setActiveBoard] = useState(null);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const [currBoard, setCurrBoard] = useState(null);

  useEffect(() => {
    socketService.emit(SOCKET_EMIT_SET_TOPIC, boardId);
  }, []);

  useEffect(() => {
    loadBoards();
    loadCurrBoard();
  }, [currBoard]);

  useEffect(() => {
    socketService.on(SOCKET_EVENT_CHANGED_BOARD, (savedBoard) => {
      console.log('GOT from socket', savedBoard);
      setCurrBoard(savedBoard);
    });
  }, []);

  async function loadCurrBoard() {
    try {
      const currBoard = await boardService.getById(boardId);
      // console.log(currBoard);
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
      // store.dispatch(getActionUpdateBoard(updatedBoard));
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
        {isEditTitle ? (
          <form
            onSubmit={(ev) => {
              onUpdateTitle(ev);
              setIsEditTitle(false);
            }}>
            <input
              className="board-title"
              type="text"
              name="title"
              placeholder={activeBoard.title}
              value={activeBoard.title}
              onChange={handleChange}
              style={{ width: activeBoard.title.length * 16 }}
            />
          </form>
        ) : (
          <div onClick={() => setIsEditTitle(true)} className="board-title">
            {activeBoard.title}
          </div>
        )}
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
