import { useEffect, useState } from "react"
import { boardService } from "../services/board.service"
// import { utilService } from "../services/util.service"

export function CheckListEdit({ taskToEdit, checklistIdx, todoId }) {

    const [todoToEdit, setTodoToEdit] = useState(boardService.getEmptyTodo())

    useEffect(() => {
        if (todoId) {
            const todoIdx = taskToEdit
        }
    }, [])
    return <section className="checklist-edit">
        <form>
            <textarea
                type="text"
                name="todo"
                placeholder="Add an item"
            // value={todoToEdit.}
            />
            <div className="button-container">
                <button>Add</button>
                <button className="cancel">Cancel</button>
            </div>
        </form>
    </section>
}