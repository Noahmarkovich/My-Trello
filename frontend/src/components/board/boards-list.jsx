import { useNavigate } from 'react-router-dom';
import { BoardPreview } from '../board-preview';

export function BoardsList({ icon, title, boards }) {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="board-type-header">
        {icon}
        <span>{title}</span>
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
  );
}
