import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadCars, updateCar, removeCar, addToCart, loadBoard , addGroup } from '../store/board.actions.js'

import { boardService } from '../services/board.service.js'

import { FiPlus } from 'react-icons/fi';

import { BoardList } from '../cmps/board-list.jsx'
import { GroupEdit } from '../cmps/group-edit.jsx'

export function BoardIndex() {

    const boards = useSelector(storeState => storeState.boardModule.boards)

    const [isNewGroupOpen, setIsNewGroupOpen] = useState(false)
    const [newGroup, setNewGroup] = useState(boardService.getEmptyGroup())

    useEffect(() => {
        loadBoard()
    }, [])

    async function onRemoveCar(boardId) {
        try {
            await removeCar(boardId)            
        } catch (err) {
        }
    }



    if (!boards || boards.length===0) return <div>loading</div>
    return (
        <div className='board-index'>
            <div className='board-header'>
            <h4 className='board-title'>{boards[0].title}</h4>
            </div>
            <main className='board-content'>
                <BoardList groups={boards[0].groups} boardId={boards[0]._id} setIsNewGroupOpen={setIsNewGroupOpen}/>
                {!isNewGroupOpen && <div className='new-group' onClick={() => { setIsNewGroupOpen(true) }}><span className='plus-icon'><FiPlus /></span> <span>Add another list</span></div>}
            {isNewGroupOpen && <GroupEdit setIsNewGroupOpen={setIsNewGroupOpen} boardId={boards[0]._id} group={null}/> }
                
            </main>
        </div>
    )
}

