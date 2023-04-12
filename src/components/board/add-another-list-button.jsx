import { FiPlus } from 'react-icons/fi';

export function AddAnotherListButton({ onClick }) {
  // TODO: Change to button and fix styling
  return (
    <div className="new-group" onClick={onClick}>
      <span className="plus-icon">
        <FiPlus />
      </span>{' '}
      <span>Add another list</span>
    </div>
  );
}
