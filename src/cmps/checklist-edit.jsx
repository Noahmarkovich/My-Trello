import { useEffect, useState } from "react"
import { boardService } from "../services/board.service"
import { saveTodo } from "../store/board.actions"
// import { utilService } from "../services/util.service"

export function CheckListEdit({ taskToEdit, checklistIdx, todoId, setCheckListId, groupId, boardId }) {

    const [todoToEdit, setTodoToEdit] = useState(boardService.getEmptyTodo())

    useEffect(() => {
        if (todoId) {
            const currTodo = taskToEdit.checklists[checklistIdx].todos.find(todo => todo.id === todoId)
            setTodoToEdit(currTodo)
        }
    }, [])


    function handleChange({ target }) {
        const { value, name: field } = target
        setTodoToEdit((prevTodo) => ({ ...prevTodo, [field]: value }))
    }

    async function addTodo(ev) {
        // console.log('hi');
        ev.preventDefault()
        try {
            saveTodo(todoToEdit, taskToEdit.checklists[checklistIdx], taskToEdit, groupId, boardId)
            setTodoToEdit(boardService.getEmptyTodo())
        } catch (err) {
            console.log(err)
        }
    }

    // console.log(todoToEdit);
    return <section className="checklist-edit">
        <form onSubmit={(ev) => addTodo(ev)}>
            <textarea
                type="text"
                name="title"
                placeholder="Add an item"
                value={todoToEdit.title}
                onChange={handleChange}
            />
            <div className="button-container">
                <button>Add</button>
                <button onClick={() => setCheckListId(null)} className="cancel">Cancel</button>
            </div>
        </form>
    </section>
}