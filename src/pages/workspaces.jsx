import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BoardPreview } from '../components/board-preview';
import { loadBoards } from '../store/board.actions';
import { AiOutlineStar } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
export function Workspaces() {
  const boards = useSelector((storeState) => storeState.boardModule.boards);
  const navigate = useNavigate();
  useEffect(() => {
    loadBoards();
  }, []);

  if (!boards) {
    return <div> loading</div>;
  }

  return (
    <section className="workspaces">
      {boards.some((board) => board.isStarred) && (
        <div>
          <h1 className="board-type-header">
            <AiOutlineStar className="board-title-icon" />
            <span>Starred boards</span>
          </h1>
          <div className="board-list">
            {boards.map((board) => {
              if (board.isStarred) {
                return (
                  <BoardPreview
                    onClick={() => navigate(`/board/${board._id}`)}
                    key={board._id}
                    board={board}
                  />
                );
              }
            })}
          </div>
        </div>
      )}
      <div>
        <h1 className="board-type-header">
          <BsPerson className="board-title-icon" />
          <span>Your boards</span>
        </h1>
        <div className="board-list">
          {boards.map((board) => {
            return (
              <BoardPreview
                onClick={() => navigate(`/board/${board._id}`)}
                key={board._id}
                board={board}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
