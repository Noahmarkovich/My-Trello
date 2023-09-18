import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { BoardList } from '../components/board/board-list';
import { AddAnotherListButton } from '../components/board/add-another-list-button.jsx';
import { GroupEdit } from '../components/board/group/group-edit';
import { boardService } from '../services/board.service.js';
import {
  dispatchBoard,
  loadBoards,
  removeBoard,
  removeGroup,
  updateBoard
} from '../store/board.actions.js';
import {
  SOCKET_EMIT_SET_TOPIC,
  SOCKET_EVENT_CHANGED_BOARD,
  socketService
} from '../services/socket.service.js';
import { BoardHeader } from '../components/board/board-header.jsx';
import { Loader } from '../components/common/loader.jsx';
import { SET_ACTIVE_BOARD } from '../store/board.reducer.js';

export function BoardPage() {
  const user = useSelector((storeState) => storeState.userModule.user);
  const { boardId } = useParams();
  const activeBoard = useSelector((storeState) => storeState.boardModule.activeBoard);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);
  const [isEditTitle, setIsEditTitle] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadBoards();
    loadCurrentBoard();
    socketService.emit(SOCKET_EMIT_SET_TOPIC, boardId);

    return () => dispatchBoard(SET_ACTIVE_BOARD, null);
  }, []);

  useEffect(() => {
    socketService.on(SOCKET_EVENT_CHANGED_BOARD, (savedBoard) => {
      dispatchBoard(SET_ACTIVE_BOARD, savedBoard);
    });

    return () => {
      socketService.off(SOCKET_EVENT_CHANGED_BOARD);
    };
  }, []);

  async function loadCurrentBoard() {
    try {
      const activeBoard = await boardService.getById(boardId);
      dispatchBoard(SET_ACTIVE_BOARD, activeBoard);
    } catch (err) {
      console.log(err);
    }
  }

  async function onRemoveBoard() {
    try {
      await removeBoard(boardId);
      navigate('/workspaces');
    } catch (err) {
      console.log(err);
    }
  }

  async function onRemoveGroup(ev, groupId) {
    ev.stopPropagation();

    try {
      const updatedBoard = await removeGroup(groupId, boardId);
      dispatchBoard(SET_ACTIVE_BOARD, updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }

  async function onMarkStarred() {
    try {
      const isStarred = activeBoard.isStarred;
      const board = await updateBoard('isStarred', !isStarred, boardId);
      dispatchBoard(SET_ACTIVE_BOARD, board);
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange({ target }) {
    const { value, name: field } = target;
    dispatchBoard(SET_ACTIVE_BOARD, {
      ...activeBoard,
      [field]: value
    });
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
        onRemoveBoard={onRemoveBoard}
      />
      <main className="board-content">
        <BoardList
          onRemoveGroup={onRemoveGroup}
          groups={activeBoard.groups}
          boardId={boardId}
          board={activeBoard}
          setActiveBoard={(board) => dispatchBoard(SET_ACTIVE_BOARD, board)}
          user={user}
        />
        {!isNewGroupOpen ? (
          <div>
            <AddAnotherListButton
              onClick={() => {
                setIsNewGroupOpen(true);
              }}
            />
          </div>
        ) : (
          <GroupEdit
            setIsNewGroupOpen={setIsNewGroupOpen}
            boardId={boardId}
            group={null}
            onClose={() => setIsNewGroupOpen(false)}
            setActiveBoard={(board) => dispatchBoard(SET_ACTIVE_BOARD, board)}
          />
        )}
        <Outlet context={[(board) => dispatchBoard(SET_ACTIVE_BOARD, board)]} />
      </main>
    </div>
  );
}
