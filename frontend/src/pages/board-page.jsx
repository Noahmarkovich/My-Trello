import { useEffect, useState } from 'react';
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
import { BoardHeader } from '../components/board/board-header.jsx';
import { Loader } from '../components/loader.jsx';

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
      const board = await updateBoard('isStarred', !isStarred, boardId);
      setActiveBoard(board);
    } catch (err) {
      console.log(err);
    }
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

  if (!activeBoard || boards.length === 0) {
    return <Loader height={'95vh'} />;
  }

  return (
    <div
      style={{
        backgroundImage: activeBoard.style.background
      }}
      className="board-index">
      <BoardHeader
        isEditTitle={isEditTitle}
        onSubmitTitle={(ev) => {
          onUpdateTitle(ev);
          setIsEditTitle(false);
        }}
        activeBoard={activeBoard}
        handleChange={handleChange}
        clickEditTitle={() => setIsEditTitle(true)}
        onMarkStarred={onMarkStarred}
      />
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
          <div>
            <AddAnotherListButton
              onClick={() => {
                setIsNewGroupOpen(true);
              }}
            />
          </div>
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
