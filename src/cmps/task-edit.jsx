import { useEffect, useState } from "react"
import { boardService } from "../services/board.service"
import x from '../assets/img/x.svg'
import { addTask } from "../store/board.actions"

export function TaskEdit({setNewTaskGroupId, setTaskId, groupId, boardId, task,onRemoveTask}){

    const [newTask, setNewTask] = useState(boardService.getEmptyTask())

    
    useEffect(() => {
        if (!task) return
        setNewTask(task)
    }, [])


    async function onAddTask(ev){
        ev.preventDefault()
        try{
            const savedTask = await addTask(newTask, groupId, boardId)
            setNewTask(boardService.getEmptyTask())
            // setIsNewGroupOpen(false)
        }catch (err) {
        console.log(err)
    }  
    }
    async function onEditTask(ev){
        ev.preventDefault()
        try{
            const savedTask = await addTask(newTask, groupId, boardId)
            setTaskId(null)
            // setNewTask(boardService.getEmptyTask())
            // setIsNewGroupOpen(false)
        }catch (err) {
        console.log(err)
    }  
    }

    function handleChange({target}){
        const { value, name: field } = target
        setNewTask((prevGroup) => ({ ...prevGroup, [field]: value }))     
    }

    function closeForm(){
        setNewTaskGroupId(null)
        setNewTask(boardService.getEmptyTask())
    }



    return <div className='task-edit'>
        {/* <div className="task-editor-background"> */}

    <form onSubmit={newTask.id ? onEditTask : onAddTask}>
        <div className="task-composer">
        <textarea
            type="text"
            name="title"
            value={newTask.title}
            placeholder="Enter a title for this card..."
            onChange={handleChange}
            required
            />
        </div>
        <div className='buttons-container'>
            <button>{newTask.id ? 'Save' : 'Add card'}</button>
            <img onClick={newTask.id ? ()=>onRemoveTask( newTask.id, groupId, boardId) : closeForm} className="icon delete" src={x} />
        </div>
    </form>
            {/* </div> */}
</div>
}