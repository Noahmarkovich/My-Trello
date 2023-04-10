import { useEffect, useState } from 'react';
import { HiCurrencyRupee } from 'react-icons/hi';
import { TbCheckbox } from 'react-icons/tb';
import { addTask } from '../store/board.actions';
import { CheckListEdit } from './checklist-edit';

export function TaskChecklist({ currTask, groupId, boardId }) {

    // const [taskToEdit, setTaskToEdit] = useState(currTask)
    const [checkListId, setCheckListId] = useState(null)

    // useEffect(() => {
    //     addTask(taskToEdit, groupId, boardId)
    // }, [taskToEdit])

    // async function handleChange({ target }) {

    //     const { value, name: field, id } = target

    //     const checklistIdx = taskToEdit.checklists.findIndex(checklist => checklist.todos.map(todo => todo.id === id))
    //     const todoIdx = taskToEdit.checklists[checklistIdx].todos.findIndex(todo => todo.id === id)

    //     taskToEdit.checklists[checklistIdx].todos[todoIdx].isDone = !taskToEdit.checklists[checklistIdx].todos[todoIdx].isDone

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
        // taskToEdit.checklists[checklistIdx].todos[todoIdx].isDone = !taskToEdit.checklists[checklistIdx].todos[todoIdx].isDone

    }
    console.log(currTask);
    return <section className="task-checklist">
        {currTask.checklists.map((checklist, checkListIdx) =>
            <main >

                <div className="checklist-title">
                    <TbCheckbox className='checklist-icon' />
                    <div className='flex justify-space-between align-center full-width'>
                        <div>{checklist.title}</div>
                        <button className='gray-btn'>Delete</button>
                    </div>
                </div>
                <div className='checklist-progress'>
                    <span className='percentage'>%</span>
                    <div className='checklist-progress-bar'></div>
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
                    <CheckListEdit taskToEdit={currTask} checklistIdx={checkListIdx} todoId={null} />
                    :
                    <button onClick={() => setCheckListId(checklist.id)} className='gray-btn add'>Add an item</button>
                }
            </main>

        )}
    </section>
}