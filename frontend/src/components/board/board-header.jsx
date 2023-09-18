import { HiOutlineStar } from 'react-icons/hi';
import { BsThreeDots } from 'react-icons/bs';
import { useRef, useState } from 'react';
import { BoardHeaderMenu } from './board-header-menu';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

export function BoardHeader({
  isEditTitle,
  onSubmitTitle,
  activeBoard,
  handleChange,
  clickEditTitle,
  onMarkStarred,
  onRemoveBoard
}) {
  const [isBoardOptionsOpen, setIsBoardOptionsOpen] = useState(false);
  const boardMenuRef = useRef(null);
  useOnClickOutside(boardMenuRef, () => setIsBoardOptionsOpen(false));

  return (
    <div className="board-header">
      <div className="title-container">
        {isEditTitle ? (
          <form onSubmit={onSubmitTitle}>
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
          <div onClick={clickEditTitle} className="board-title">
            {activeBoard.title}
          </div>
        )}
        <button onClick={onMarkStarred} className="clean-btn star">
          <HiOutlineStar className={activeBoard.isStarred ? 'star-icon full' : 'star-icon'} />
        </button>
      </div>
      <button onClick={() => setIsBoardOptionsOpen(true)} className="board-header-options">
        <BsThreeDots />
      </button>
      {isBoardOptionsOpen && (
        <BoardHeaderMenu boardMenuRef={boardMenuRef} onRemoveBoard={onRemoveBoard} />
      )}
    </div>
  );
}
