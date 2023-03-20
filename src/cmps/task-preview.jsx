import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { boardService } from "../services/board.service"
import { addTask } from "../store/board.actions"

import groupTitle  from '../assets/img/groupTitle.svg'
import { TaskDescription } from "./task-description"
import { GrClose } from 'react-icons/gr';
import { TaskSideBar } from "./task-sidebar"


export function TaskPreview(){
    const navigate = useNavigate()
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const { groupId, taskId } = useParams()
    const [currTask, setCurrTask] = useState(null)
    const [currGroup, setCurrGroup] = useState(null)

    useEffect(() => {
        loadTask(taskId,groupId,boards[0]._id)
    }, [])

    async function loadTask(taskId,groupId,boardId){
        try{
            const {task , group} = await boardService.queryTask(taskId,groupId,boards[0]._id)
            setCurrTask(task)
            setCurrGroup(group)
            
        }catch(err){
            console.log(err)
        }
    }

    function handleChange({ target }) {
        const { value, name: field } = target
        setCurrTask((prevGroup) => ({ ...prevGroup, [field]: value }))
    }

    async function onEditTask(ev){
        ev.preventDefault()
        try{
            const savedTask = await addTask(currTask, currGroup.id, boards[0]._id)
            // setTaskId(null)
            // setNewTask(boardService.getEmptyTask())
            // setIsNewGroupOpen(false)
        }catch (err) {
        console.log(err)
    }  
    }

    function closePreview(){
            navigate(`/board`)     
    
    }

    if (!currTask || !currGroup) return <div>loading...</div>
    return <section className="dark-screen">
        <div className="task-preview">
            <section className="preview-header">
            
            <img className="icon" src={groupTitle}/>
                <input
                type="text"
                name="title"
                placeholder={currTask.title}
                value={currTask.title}/>
            <button onClick={closePreview}><GrClose/></button>
            </section>
            <p>in list <span>{currGroup.title}</span></p>
            <main>
            <TaskDescription currTask={currTask} onEditTask={onEditTask} handleChange={handleChange}/>
            <TaskSideBar/>    
            </main>
        </div>
    </section>
} 