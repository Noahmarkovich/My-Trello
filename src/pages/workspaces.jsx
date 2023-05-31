import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { BoardPreview } from '../components/board-preview';
import { loadBoard } from '../store/board.actions';
import { AiOutlineStar } from 'react-icons/ai';
import { BsPerson } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
export function Workspaces() {
  const boards = useSelector((storeState) => storeState.boardModule.boards);
  const navigate = useNavigate();
  useEffect(() => {
    loadBoard();
  }, []);
  if (!boards) {
    return <div> loading</div>;
  }

  console.log(boards);

  return (
    <section className="workspaces">
      {boards.map((board) => {
        return (
          board.isStarred && (
            <div onClick={() => navigate(`/board/${board._id}`)} key={board._id}>
              <h1 className="board-type-header">
                <AiOutlineStar className="board-title-icon" />
                <span>Starred boards</span>
              </h1>
              <div className="board-list">
                <BoardPreview key={board._id} board={board} />
              </div>
            </div>
          )
        );
      })}
      {boards.map((board) => {
        return (
          <div onClick={() => navigate(`/board/${board._id}`)} key={board._id}>
            <h1 className="board-type-header">
              <BsPerson className="board-title-icon" />
              <span>Your boards</span>
            </h1>
            <div className="board-list">
              <BoardPreview key={board._id} board={board} />
            </div>
          </div>
        );
      })}
    </section>
  );
}
