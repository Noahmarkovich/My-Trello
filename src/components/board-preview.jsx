export function BoardPreview({ board, onClick }) {
  return (
    <section
      style={{
        backgroundImage: board.style.background
      }}
      onClick={onClick}
      className="board-preview">
      <div className="preview-title">{board.title}</div>
    </section>
  );
}
