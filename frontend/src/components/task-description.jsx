import { useState } from 'react';
import paragraph from '../assets/img/paragraph.svg';

export function TaskDescription({ currTask, onEditTask, handleChange }) {
  const [isButtonsShown, setIsButtonsShown] = useState(false);

  return (
    <section className="description">
      <div className="description-title">
        <img className="icon" src={paragraph} />
        <div>Description</div>
      </div>
      <form
        onSubmit={(ev) => {
          onEditTask(ev);
          setIsButtonsShown(false);
        }}>
        <textarea
          onFocus={() => setIsButtonsShown(true)}
          type="text"
          name="description"
          placeholder="Add a more detailed description..."
          value={currTask['description']}
          onChange={handleChange}
        />
        {isButtonsShown && (
          <div className="button-container">
            <button>Save</button>
            <button onClick={() => setIsButtonsShown(false)} className="cancel">
              Cancel
            </button>
          </div>
        )}
      </form>
    </section>
  );
}
