import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadCars, addCar, updateCar, removeCar, addToCart, loadBoard } from '../store/board.actions.js'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { boardService } from '../services/board.service.js'

import { FiPlus } from 'react-icons/fi';

export function BoardIndex() {

    const board = useSelector(storeState => storeState.boardModule.board)

    const [isNewListOpen, setIsNewListOpen] = useState(false)

    useEffect(() => {
        loadBoard()
    }, [])

    async function onRemoveCar(boardId) {
        try {
            await removeCar(boardId)
            showSuccessMsg('Board removed')            
        } catch (err) {
            showErrorMsg('Cannot remove board')
        }
    }

    async function onAddCar() {
        const board = boardService.getEmptyCar()
        board.vendor = prompt('Vendor?')
        try {
            const savedCar = await addCar(board)
            showSuccessMsg(`Board added (id: ${savedCar._id})`)
        } catch (err) {
            showErrorMsg('Cannot add board')
        }        
    }

    async function onUpdateCar(board) {
        const price = +prompt('New price?')
        const boardToSave = { ...board, price }
        try {
            const savedCar = await updateCar(boardToSave)
            showSuccessMsg(`Board updated, new price: ${savedCar.price}`)
        } catch (err) {
            showErrorMsg('Cannot update board')
        }        
    }

    function onAddToCart(board){
        console.log(`Adding ${board.vendor} to Cart`)
        addToCart(board)
        showSuccessMsg('Added to Cart')
    }

    function onAddCarMsg(board) {
        console.log(`TODO Adding msg to board`)
    }

    console.log(board)
    if (!board || board.length===0) return <div>loading</div>
    return (
        <div className='board-index'>
            <div className='board-header'>
            <h4 className='board-title'>{board.title}</h4>
            </div>
            <main>
                <ul className="board-list">
                    {board.groups.map(group =>
                        <li className="group-preview" key={group._id}>
                            <h1>{group.title}</h1>
                            {group.tasks.map(task=> 
                                <div className="task" key={task._id}>{task.title}</div>
                            )}
                            {/* <p>Price: <span>${board.price.toLocaleString()}</span></p> */}
                            {/* <p>Owner: <span>{board.owner && board.owner.fullname}</span></p> */}
                            {/* <div> */}
                                {/* <button onClick={() => { onRemoveCar(board._id) }}>x</button> */}
                                {/* <button onClick={() => { onUpdateCar(board) }}>Edit</button> */}
                            {/* </div> */}
{/* 
                            <button className="buy" onClick={() => { onAddToCart(board) }}>Add to boardt</button>  */}
                        </li>)
                    }
                    {!isNewListOpen && <div className='new-list' onClick={() => { setIsNewListOpen(true) }}><span className='plus-icon'><FiPlus/></span> <span>Add another list</span></div>}
                    {/* <form>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                        autoFocus
                    />
                    </form> */}
                </ul> 
            </main>
        </div>
    )
}