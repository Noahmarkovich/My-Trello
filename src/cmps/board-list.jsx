import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { GroupEdit } from "./group-edit";
import { TaskEdit } from "./task-edit";

export function BoardList({ groups, boardId, setIsNewGroupOpen }) {

    const [newTaskGroupId, setNewTaskGroupId] = useState(null)
    const [taskId, setTaskId] = useState(null)
    const [groupId, setGroupId] = useState(null)

    function openEdit(taskId, groupId){
        // setNewTaskGroupId(groupId)
        setTaskId(taskId)
    }

    return <ul className="board-list">
        {groups.map(group =>
            <li className="group-preview" key={group.id}>
                {groupId === group.id ?
                 <GroupEdit setIsNewGroupOpen={setIsNewGroupOpen} boardId={boardId} group={group} setGroupId={setGroupId}/> :
                 <h1 onClick={()=> setGroupId(group.id)}>{group.title}</h1> } 
                {group.tasks.map(task =>
                    <div className="task" key={task.id}>
                    {taskId === task.id  ? 
                    <TaskEdit setNewTaskGroupId={setNewTaskGroupId} setTaskId={setTaskId} groupId = {group.id} boardId={boardId} task={task}/> : 
                    <span>{task.title}</span>}
                    <button onClick={()=> openEdit(task.id, group.id)} className="edit"><MdOutlineModeEditOutline/></button></div>
       
                )}

                {/* <button onClick={() => { onRemoveCar(board._id) }}>x</button> */}
                {/* 
                            <button className="buy" onClick={() => { onAddToCart(board) }}>Add to boardt</button>  */}
                {newTaskGroupId === group.id ? 
                <TaskEdit setNewTaskGroupId={setNewTaskGroupId} setTaskId={setTaskId} groupId = {group.id} boardId={boardId} task={null}/>
                :
                <div onClick={()=>setNewTaskGroupId(group.id)} className="add-task"><span className='plus-icon'><FiPlus /></span><span>Add a card</span></div>
                }
            </li>)
        }
    </ul>

}