import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";
import { GroupEdit } from "./group-edit";
import { TaskEdit } from "./task-edit";
import { removeTask } from "../store/board.actions";
import { useNavigate } from "react-router-dom";
import paragraph from '../assets/img/paragraph.svg'



export function BoardList({ onRemoveGroup, groups, boardId, setIsNewGroupOpen, board }) {

    const navigate = useNavigate()
    const [newTaskGroupId, setNewTaskGroupId] = useState(null)
    const [taskId, setTaskId] = useState(null)
    const [groupId, setGroupId] = useState(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isOpenSmallLabel, setIsOpenSmallLabel] = useState(false)

    function openEdit(ev, taskId, groupId) {
        ev.stopPropagation()
        setIsMenuOpen(false)
        setTaskId(taskId)
    }
    function openAdd(groupId) {
        setIsMenuOpen(false)
        setNewTaskGroupId(groupId)
    }

    function openActionMenu(groupId) {
        newTaskGroupId === groupId ? setNewTaskGroupId(null) : setNewTaskGroupId(groupId)
        setIsMenuOpen(!isMenuOpen)
    }

    async function onRemoveTask(taskId, groupId, boardId) {
        try {
            await removeTask(taskId, groupId, boardId)
        } catch (err) {
            console.log(err)
        }
    }
    function openPreview(ev, taskId, groupId) {
        ev.stopPropagation()
        navigate(`/board/${groupId}/${taskId}`)
    }

    return <ul className="board-list">
        {groups.map(group =>
            <li className="group-preview" key={group.id}>
                <div className="title-container">
                    {groupId === group.id ?
                        <GroupEdit setIsNewGroupOpen={setIsNewGroupOpen} boardId={boardId} group={group} setGroupId={setGroupId} /> :
                        <h1 onClick={() => setGroupId(group.id)}>{group.title}</h1>}
                    <button onClick={() => openActionMenu(group.id)}><HiDotsHorizontal /></button>
                </div>
                {group.tasks.map(task =>
                    <div onClick={(ev) => openPreview(ev, task.id, group.id)} className="task" key={task.id}>
                        {task.labelIds && <div className="small-labels">
                            {task.labelIds
                                .map(labelId => {
                                    const label = board.labels.find((label) => label.id === labelId);

                                    return <button onClick={(ev) => {
                                        ev.stopPropagation()
                                        setIsOpenSmallLabel(!isOpenSmallLabel)
                                    }

                                    } style={isOpenSmallLabel ? { backgroundColor: `${label.colorLight}` } : { backgroundColor: `${label.colorDark}` }} className={`small-label ${isOpenSmallLabel && 'open-small-label'}`}>
                                        <div className="inner-color" style={{ backgroundColor: `${label.colorDark}` }}></div>
                                        {label.title}
                                    </button>
                                })}
                        </div>}
                        {taskId === task.id ?
                            <TaskEdit setNewTaskGroupId={setNewTaskGroupId} setTaskId={setTaskId} groupId={group.id} boardId={boardId} task={task} onRemoveTask={onRemoveTask} /> :
                            <span className="task-title">{task.title}</span>}
                        <button onClick={(ev) => openEdit(ev, task.id, group.id)} className="edit"><MdOutlineModeEditOutline /></button>
                        {task.description && <img className="icon description-img" src={paragraph} />}

                    </div>

                )}

                {/* <button onClick={() => { onRemoveCar(board._id) }}>x</button> */}
                {/* 
                            <button className="buy" onClick={() => { onAddToCart(board) }}>Add to boardt</button>  */}
                {(newTaskGroupId === group.id && !isMenuOpen) ?
                    <TaskEdit setNewTaskGroupId={setNewTaskGroupId} setTaskId={setTaskId} groupId={group.id} boardId={boardId} task={null} onRemoveTask={onRemoveTask} />
                    :
                    <div onClick={() => openAdd(group.id)} className="add-task"><span className='plus-icon'><FiPlus /></span><span>Add a card</span></div>
                }
                {(isMenuOpen && group.id === newTaskGroupId) &&
                    <div className="actions-menu">
                        <div className="title">List actions</div>
                        <div onClick={(ev) => onRemoveGroup(ev, group.id)} className="action">Delete list</div>
                    </div>}
            </li>)
        }
    </ul>

}