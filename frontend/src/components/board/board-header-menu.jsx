export function BoardHeaderMenu({ boardMenuRef, onRemoveBoard }) {
  return (
    <div ref={boardMenuRef} className="board-header-menu">
      <h1 className="options-header">Menu</h1>
      <div onClick={onRemoveBoard} className="option">
        Remove board
      </div>
    </div>
  );
}
