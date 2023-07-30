import { useState } from 'react';
import { HiDotsHorizontal } from 'react-icons/hi';
import { GroupEdit } from '../../group-edit';

export function GroupPreviewTitle({ boardId, group, openActionMenu, setActiveBoard }) {
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <div className="title-container">
      {isEditMode ? (
        <GroupEdit
          boardId={boardId}
          group={group}
          onClose={() => setIsEditMode(false)}
          setActiveBoard={setActiveBoard}
        />
      ) : (
        <h1 onClick={() => setIsEditMode(true)}>{group.title}</h1>
      )}
      <button onClick={() => openActionMenu(group.id)}>
        <HiDotsHorizontal />
      </button>
    </div>
  );
}
