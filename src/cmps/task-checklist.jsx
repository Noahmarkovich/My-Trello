import { useEffect, useState } from 'react';
import { HiCurrencyRupee } from 'react-icons/hi';
import { TbCheckbox } from 'react-icons/tb';
import { addTask, removeChecklist } from '../store/board.actions';
import { CheckListEdit } from './checklist-edit';
import ProgressBar from 'react-bootstrap/ProgressBar';

export function TaskChecklist({ currTask, groupId, boardId }) {

    const [taskToEdit, setTaskToEdit] = useState(currTask)
    const [checkListId, setCheckListId] = useState(null)

    // useEffect(() => {
    //     addTask(taskToEdit, groupId, boardId)
    // }, [taskToEdit])

    // async function handleChange({ target }) {

    //     const { value, name: field, id } = target

    //     const checklistIdx = taskToEdit.checklists.findIndex(checklist => checklist.todos.map(todo => todo.id === id))
    //     const todoIdx = taskToEdit.checklists[checklistIdx].todos.findIndex(todo => todo.id === id)

    //     taskToEdit.checklists[checklistIdx].todos[todoIdx].isDone = !taskToEdit.checklists[checklistIdx].todos[todoIdx].isDone


    function calculatePres(checklist) {

        const numOfDone = checklist.todos.reduce((acc, todo) => todo.isDone ? acc + 1 : acc + 0, 0)
        const percentage = checklist.todos.length > 0 ? Math.round(numOfDone / checklist.todos.length * 100) : 0
        return percentage
    }

    async function handleChange(todoIdx, checkListIdx, isDone) {
        const updatedTask = {
            ...currTask,
            checklists:
                currTask.checklists.map((checklist, idx) => {
                    if (checkListIdx !== idx) {
                        return checklist;
                    }

                    return {
                        ...checklist,
                        todos: checklist.todos.map((todo, idx) => {
                            if (todoIdx !== idx) {
                                return todo;
                            }
                            return {
                                ...todo,
                                isDone
                            }
                        })
                    }
                })
        }



        addTask(updatedTask, groupId, boardId)
    }


    async function deleteChecklist(checklist) {
        try {
            await removeChecklist(checklist, currTask.id, groupId, boardId)
        } catch (err) {
            console.log(err)
        }
    }

    // console.log(currTask);
    return <section className="task-checklist">
        {currTask.checklists.map((checklist, checkListIdx) =>
            <main >

                <div className="checklist-title">
                    <TbCheckbox className='checklist-icon' />
                    <div className='flex justify-space-between align-center full-width'>
                        <div>{checklist.title}</div>
                        <button className='gray-btn' onClick={(checklist) => deleteChecklist(checklist)}>Delete</button>
                    </div>
                </div>
                <div className='checklist-progress'>
                    <span className='percentage'>{calculatePres(checklist)}%</span>
                    {/* <div className='checklist-progress-bar'></div> */}
                    <ProgressBar animated now={calculatePres(checklist)} variant="success" />
                </div>
                <div className='todos'>
                    {checklist.todos && checklist.todos.map((todo, todoIdx) =>
                        <ul>
                            <li key={todo.id} className={todo.isDone ? 'todo checked' : 'todo'}>
                                <input className='todo-input' name="todos" type="checkbox" id={todo.id} onChange={() => handleChange(todoIdx, checkListIdx, !todo.isDone)} checked={todo.isDone} />
                                {/* <input className='todo-input' name="todos" type="checkbox" id={todo.id} onChange={handleChange} checked={todo.isDone} /> */}
                                {todo.title}
                            </li>
                        </ul>
                    )}
                </div>
                {checkListId === checklist.id ?
                    <CheckListEdit taskToEdit={currTask} checklistIdx={checkListIdx} todoId={null} setCheckListId={setCheckListId} groupId={groupId} boardId={boardId} />
                    :
                    <button onClick={() => setCheckListId(checklist.id)} className='gray-btn add'>Add an item</button>
                }
            </main>
        )}
    </section>
}