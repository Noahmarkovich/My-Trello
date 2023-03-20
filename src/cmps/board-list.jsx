import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";
import { GroupEdit } from "./group-edit";
import { TaskEdit } from "./task-edit";
import { removeTask } from "../store/board.actions";
import { useNavigate } from "react-router-dom";

export function BoardList({ onRemoveGroup,  groups, boardId, setIsNewGroupOpen }) {

    const navigate = useNavigate()
    const [newTaskGroupId, setNewTaskGroupId] = useState(null)
    const [taskId, setTaskId] = useState(null)
    const [groupId, setGroupId] = useState(null)
    const [isMenuOpen , setIsMenuOpen] = useState(false)

    function openEdit(taskId, groupId){
        // setNewTaskGroupId(groupId)
        setIsMenuOpen(false)
        setTaskId(taskId)
    }
    function openAdd( groupId){
        setIsMenuOpen(false)
        setNewTaskGroupId(groupId)
    }

    function openActionMenu (groupId){
        newTaskGroupId ===groupId ? setNewTaskGroupId(null) : setNewTaskGroupId(groupId)
        setIsMenuOpen(!isMenuOpen)
    }
    
    async function onRemoveTask( taskId, groupId, boardId){
        try {
            await removeTask(taskId,groupId, boardId)
        } catch (err) {
            console.log(err)
    }
}
    function openPreview(taskId, groupId){
        navigate(`/board/${groupId}/${taskId}`)
    }

    return <ul className="board-list">
        {groups.map(group =>
            <li className="group-preview" key={group.id}>
                <div className="title-container">
                {groupId === group.id ?
                 <GroupEdit setIsNewGroupOpen={setIsNewGroupOpen} boardId={boardId} group={group} setGroupId={setGroupId}/> :
                 <h1 onClick={()=> setGroupId(group.id)}>{group.title}</h1> } 
                <button onClick={()=>openActionMenu(group.id)}><HiDotsHorizontal/></button> 
                </div>
                {group.tasks.map(task =>
                    <div onClick={()=>openPreview(task.id, group.id)} className="task" key={task.id}>
                    {taskId === task.id  ? 
                    <TaskEdit setNewTaskGroupId={setNewTaskGroupId} setTaskId={setTaskId} groupId = {group.id} boardId={boardId} task={task} onRemoveTask={onRemoveTask}/> : 
                    <span>{task.title}</span>}
                    <button onClick={()=> openEdit(task.id, group.id)} className="edit"><MdOutlineModeEditOutline/></button>
                    </div>
       
       )}

                {/* <button onClick={() => { onRemoveCar(board._id) }}>x</button> */}
                {/* 
                            <button className="buy" onClick={() => { onAddToCart(board) }}>Add to boardt</button>  */}
                {(newTaskGroupId === group.id && !isMenuOpen )? 
                <TaskEdit setNewTaskGroupId={setNewTaskGroupId} setTaskId={setTaskId} groupId = {group.id} boardId={boardId} task={null} onRemoveTask={onRemoveTask}/>
                :
                <div onClick={()=>openAdd(group.id)} className="add-task"><span className='plus-icon'><FiPlus /></span><span>Add a card</span></div>
            }
        {(isMenuOpen && group.id === newTaskGroupId) &&
        <div className="actions-menu">
            <div className="title">List actions</div>
            <div onClick={(ev)=>onRemoveGroup(ev, group.id)} className="action">Delete list</div>
        </div>}
            </li>)
        }
    </ul>

}