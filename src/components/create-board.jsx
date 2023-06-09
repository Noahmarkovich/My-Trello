import { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { boardService } from '../services/board.service';
import { addBoard } from '../store/board.actions';

export function CreateBoard({ onClose }) {
  const backgrounds = [
    {
      header: 'rgb(23, 66, 142)',
      background: "url('https://a.trellocdn.com/prgb/assets/d106776cb297f000b1f4.svg')"
    },
    {
      header: 'rgb(8, 71, 158)',
      background: "url('https://a.trellocdn.com/prgb/assets/707f35bc691220846678.svg')"
    },
    {
      header: 'rgb(7, 45, 97)',
      background: 'url("https://a.trellocdn.com/prgb/assets/8ab3b35f3a786bb6cdac.svg")'
    },
    {
      header: 'rgb(63, 52, 145)',
      background: 'url("https://a.trellocdn.com/prgb/assets/a7c521b94eb153008f2d.svg")'
    },
    {
      header: 'rgb(135, 32, 19)',
      background: 'url("https://a.trellocdn.com/prgb/assets/aec98becb6d15a5fc95e.svg")'
    },
    {
      header: 'rgb(28, 80, 74)',
      background: 'url("https://a.trellocdn.com/prgb/assets/92e67a71aaaa98dea5ad.svg")'
    }
  ];
  const [newBoard, setNewBoard] = useState(boardService.getEmptyBoard());

  function handleChange({ target }) {
    const { value, name: field } = target;
    setNewBoard((prevBoard) => ({ ...prevBoard, [field]: value }));
  }

  async function onAddBoard(ev) {
    ev.preventDefault();
    try {
      await addBoard(newBoard);
      setNewBoard(boardService.getEmptyBoard());
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <section className="create-board">
      <div className="create-board-header">
        <h2>Create board</h2>
        <button onClick={onClose} className="exit-btn-clean">
          <GrClose className="exit" />
        </button>
      </div>
      <main className="main-create-board">
        <div
          style={{
            backgroundImage: newBoard.style.background
          }}
          className="background-preview">
          <img
            src="https://a.trellocdn.com/prgb/dist/images/board-preview-skeleton.14cda5dc635d1f13bc48.svg"
            alt=""
          />
        </div>
        <div className="background-picker">
          <h1 className="board-title">Background</h1>
          <div className="background-options">
            {backgrounds.map((background) => {
              return (
                <div
                  key={background.color}
                  className="background-option"
                  style={{
                    backgroundImage: background.background
                  }}
                  onClick={() =>
                    setNewBoard((prevBoard) => ({ ...prevBoard, ['style']: background }))
                  }></div>
              );
            })}
          </div>
        </div>
        <div>
          <h1 className="board-title">
            Board title <span>*</span>
          </h1>
          <form onSubmit={(ev) => onAddBoard(ev)}>
            <input
              autoFocus
              type="text"
              name="title"
              value={newBoard.title}
              onChange={handleChange}
            />
            <button className="full-width">Create</button>
          </form>
        </div>
        <section className="background-picker"></section>
      </main>
    </section>
  );
}
