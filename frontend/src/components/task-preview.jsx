import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import { boardService } from '../services/board.service';
import { addTask, saveActivity } from '../store/board.actions';

import groupTitle from '../assets/img/groupTitle.svg';
import { TaskDescription } from './task-description';
import { GrClose } from 'react-icons/gr';
import { GoPlus } from 'react-icons/go';
import { TaskSideBar } from './task-sidebar';
import { Label } from './label';
import { Labels } from './labels';
import { TaskChecklist } from './task-checklist';
import { useOnClickOutside } from '../hooks/useOnClickOutside';
import { TaskDueDate } from './task-due-date';
import { TaskActivity } from './task-activity';

export function TaskPreview() {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  useOnClickOutside(modalRef, closePreview);
  const boards = useSelector((storeState) => storeState.boardModule.boards);
  const user = useSelector((storeState) => storeState.userModule.user);
  const { groupId, taskId } = useParams();
  const [currTask, setCurrTask] = useState(null);
  const [currGroup, setCurrGroup] = useState(null);
  const [previewAction, setPreviewAction] = useState(null);
  const { boardId } = useParams();
  const [currBoard, setCurrBoard] = useState(null);
  const [setActiveBoard] = useOutletContext();

  useEffect(() => {
    loadCurrBoard();
    loadTask(taskId, groupId, boardId);
  }, [boards]);

  async function loadCurrBoard() {
    try {
      const currBoard = await boardService.getById(boardId);
      setCurrBoard(currBoard);
    } catch (err) {
      console.log(err);
    }
  }

  async function loadTask(taskId, groupId) {
    try {
      const { task, group } = await boardService.queryTask(taskId, groupId, boardId);
      setCurrTask(task);
      setCurrGroup(group);
    } catch (err) {
      console.log(err);
    }
  }

  function handleChange({ target }) {
    const { value, name: field } = target;
    setCurrTask((prevGroup) => ({ ...prevGroup, [field]: value }));
  }

  async function onEditTask(ev) {
    ev.preventDefault();
    try {
      const updatedBoard = await addTask(currTask, currGroup.id, boardId);
      setActiveBoard(updatedBoard);
      // setTaskId(null)
      // setNewTask(boardService.getEmptyTask())
      // setIsNewGroupOpen(false)
    } catch (err) {
      console.log(err);
    }
  }

  function closePreview() {
    navigate(`/board/${boardId}`);
  }

  if (!currTask || !currGroup) {
    return <div>loading...</div>;
  }

  async function handleDueDateChange() {
    let activity;
    let updatedTask;
    if (currTask.isComplete) {
      updatedTask = {
        ...currTask,
        isComplete: !currTask.isComplete
      };
      activity = {
        ['txt']: `marked the due date incomplete`,
        ['task']: { id: currTask.id, title: currTask.title },
        ['byMember']: { _id: user._id, fullName: user.fullName, avatar: user.avatar }
      };
      addTask(updatedTask, groupId, boardId._id);
    } else {
      updatedTask = {
        ...currTask,
        isComplete: true
      };
      activity = {
        ['txt']: `marked the due date complete`,
        ['task']: { id: currTask.id, title: currTask.title },
        ['byMember']: { _id: user._id, fullName: user.fullName, avatar: user.avatar }
      };
    }
    try {
      await addTask(updatedTask, groupId, boardId);
      const updatedBoard = await saveActivity(activity, boardId);
      setActiveBoard(updatedBoard);
    } catch (err) {
      console.log(err);
    }
  }
  // console.log(user);

  return (
    <section className="dark-screen">
      <div className="task-preview" ref={modalRef}>
        <section className="preview-header">
          <img className="icon" src={groupTitle} />
          <input type="text" name="title" placeholder={currTask.title} value={currTask.title} />
          <button onClick={closePreview}>
            <GrClose />
          </button>
        </section>
        <p>
          in list <span>{currGroup.title}</span>
        </p>
        {currTask.labelIds && (
          <section className="label-preview">
            <h2 className="labels-header">Labels</h2>
            <div className="label">
              {' '}
              {currTask.labelIds.map((labelId) => {
                const label = currBoard.labels.find((label) => label.id === labelId);

                return <Label label={label} comesFrom={'preview'} key={label.id} />;
              })}
              <button onClick={() => setPreviewAction('label')} className="sidebar-btn">
                <GoPlus />
              </button>
            </div>
            {previewAction === 'label' && (
              <div className="labels-from-preview">
                <Labels
                  board={currBoard}
                  currTask={currTask}
                  setSidebarAction={setPreviewAction}
                  setCurrBoard={setCurrBoard}
                  setActiveBoard={setActiveBoard}
                />
              </div>
            )}
          </section>
        )}
        <main className="main-task-preview">
          <div className="middle">
            {currTask.dueDate && (
              <TaskDueDate currTask={currTask} handleDueDateChange={handleDueDateChange} />
            )}
            <TaskDescription
              currTask={currTask}
              onEditTask={onEditTask}
              handleChange={handleChange}
            />
            {currTask.checklists && (
              <TaskChecklist
                currTask={currTask}
                groupId={groupId}
                boardId={currBoard._id}
                setActiveBoard={setActiveBoard}
                user={user}
              />
            )}
            {currBoard.activities.map((activity) => activity.task.id === taskId) && (
              <TaskActivity board={currBoard} taskId={taskId} user={user} />
            )}
          </div>
          <TaskSideBar
            board={currBoard}
            currTask={currTask}
            currGroup={currGroup}
            setActiveBoard={setActiveBoard}
            user={user}
          />
        </main>
      </div>
    </section>
  );
}
