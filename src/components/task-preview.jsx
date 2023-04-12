import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { boardService } from "../services/board.service"
import { addTask } from "../store/board.actions"

import groupTitle from '../assets/img/groupTitle.svg'
import { TaskDescription } from "./task-description"
import { GrClose } from 'react-icons/gr';
import { GoPlus } from 'react-icons/go';
import { TaskSideBar } from "./task-sidebar"
import { Label } from "./label"
import { Labels } from "./labels"
import { TaskChecklist } from "./task-checklist"


export function TaskPreview() {
    const navigate = useNavigate()
    const boards = useSelector(storeState => storeState.boardModule.boards)
    const { groupId, taskId } = useParams()
    const [currTask, setCurrTask] = useState(null)
    const [currGroup, setCurrGroup] = useState(null)
    const [previewAction, setPreviewAction] = useState(null)

    useEffect(() => {
        loadTask(taskId, groupId, boards[0]._id)
    }, [boards])

    async function loadTask(taskId, groupId, boardId) {
        try {
            const { task, group } = await boardService.queryTask(taskId, groupId, boards[0]._id)
            setCurrTask(task)
            setCurrGroup(group)

        } catch (err) {
            console.log(err)
        }
    }

    function handleChange({ target }) {
        const { value, name: field } = target
        setCurrTask((prevGroup) => ({ ...prevGroup, [field]: value }))
    }

    async function onEditTask(ev) {
        ev.preventDefault()
        try {
            const savedTask = await addTask(currTask, currGroup.id, boards[0]._id)
            // setTaskId(null)
            // setNewTask(boardService.getEmptyTask())
            // setIsNewGroupOpen(false)
        } catch (err) {
            console.log(err)
        }
    }

    function closePreview() {
        navigate(`/board`)

    }

    if (!currTask || !currGroup) return <div>loading...</div>
    return <section className="dark-screen">
        <div className="task-preview">
            <section className="preview-header">

                <img className="icon" src={groupTitle} />
                <input
                    type="text"
                    name="title"
                    placeholder={currTask.title}
                    value={currTask.title} />
                <button onClick={closePreview}><GrClose /></button>
            </section>
            <p>in list <span>{currGroup.title}</span></p>
            {currTask.labelIds &&
                <section className="label-preview">
                    <h2 className="labels-header">Labels</h2>
                    {/* {currTask.labelIds
                        .map(labelId => boards[0].labels.find((label) => label.id === labelId))
                        .filter(label => label !== undefined)
                        .map((label) => (<div>{label.id}</div>))} */}

                    <div className="label"> {currTask.labelIds
                        .map(labelId => {
                            const label = boards[0].labels.find((label) => label.id === labelId);

                            return <Label label={label} comesFrom={'preview'} />
                        })}
                        <button onClick={() => setPreviewAction('label')} className="sidebar-btn"><GoPlus /></button>
                    </div>
                    {previewAction === 'label' && <div className="labels-from-preview"><Labels board={boards[0]} currTask={currTask} setSidebarAction={setPreviewAction} /></div>}
                </section>
            }
            <main className="main-task-preview">
                <div className="middle">
                    <TaskDescription currTask={currTask} onEditTask={onEditTask} handleChange={handleChange} />
                    {currTask.checklists && <TaskChecklist currTask={currTask} groupId={groupId} boardId={boards[0]._id} />}
                </div>
                <TaskSideBar board={boards[0]} currTask={currTask} currGroup={currGroup} />
            </main>
        </div>
    </section>
} 