import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { BoardList } from '../components/board-list.jsx';
import { AddAnotherListButton } from '../components/board/add-another-list-button.jsx';
import { GroupEdit } from '../components/group-edit.jsx';
import { loadBoard, removeGroup } from '../store/board.actions.js';

export function BoardPage() {
  const boards = useSelector((storeState) => storeState.boardModule.boards);
  const activeBoard = boards[0];
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);

  useEffect(() => {
    loadBoard();
  }, []);

  async function onRemoveGroup(ev, groupId) {
    ev.stopPropagation();

    try {
      await removeGroup(groupId, activeBoard._id);
    } catch (err) {
      console.log(err);
    }
  }

  if (!boards || boards.length === 0) {
    return <div>loading</div>;
  }

  return (
    <div className="board-index">
      <div className="board-header">
        <h4 className="board-title">{activeBoard.title}</h4>
      </div>
      <main className="board-content">
        <BoardList
          onRemoveGroup={onRemoveGroup}
          groups={activeBoard.groups}
          boardId={activeBoard._id}
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
          <GroupEdit setIsNewGroupOpen={setIsNewGroupOpen} boardId={activeBoard._id} group={null} />
        )}
        <Outlet />
      </main>
    </div>
  );
}
