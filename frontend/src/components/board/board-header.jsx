import { HiOutlineStar } from 'react-icons/hi';

export function BoardHeader({
  isEditTitle,
  onSubmitTitle,
  activeBoard,
  handleChange,
  clickEditTitle,
  onMarkStarred
}) {
  return (
    <div className="board-header">
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
  );
}
