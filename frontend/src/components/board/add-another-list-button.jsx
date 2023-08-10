import { FiPlus } from 'react-icons/fi';

export function AddAnotherListButton({ onClick }) {
  return (
    <button className="new-group" onClick={onClick}>
      <span className="plus-icon">
        <FiPlus />
      </span>{' '}
      <span>Add another list</span>
    </button>
  );
}
