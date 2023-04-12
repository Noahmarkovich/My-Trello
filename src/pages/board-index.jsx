import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadCars, updateCar, removeCar, addToCart, loadBoard, addGroup, removeGroup } from '../store/board.actions.js'

import { boardService } from '../services/board.service.js'

import { FiPlus } from 'react-icons/fi';

import { BoardList } from '../cmps/board-list.jsx'
import { GroupEdit } from '../cmps/group-edit.jsx'
import { Outlet } from 'react-router-dom';

export function BoardIndex() {

    const boards = useSelector(storeState => storeState.boardModule.boards)
    const activeBoard = boards[0];
    const [isNewGroupOpen, setIsNewGroupOpen] = useState(false)
    const [newGroup, setNewGroup] = useState(boardService.getEmptyGroup())

    useEffect(() => {
        loadBoard()
    }, [])



    async function onRemoveGroup(ev, groupId) {
        ev.stopPropagation()
        try {
            await removeGroup(groupId, activeBoard._id)
        } catch (err) {
            console.log(err)
        }
    }



    if (!boards || boards.length === 0) return <div>loading</div>
    return (
        <div className='board-index'>
            <div className='board-header'>
                <h4 className='board-title'>{activeBoard.title}</h4>
            </div>
            <main className='board-content'>
                <BoardList onRemoveGroup={onRemoveGroup} groups={activeBoard.groups} boardId={activeBoard._id} setIsNewGroupOpen={setIsNewGroupOpen} board={activeBoard} />
                {!isNewGroupOpen && <div className='new-group' onClick={() => { setIsNewGroupOpen(true) }}><span className='plus-icon'><FiPlus /></span> <span>Add another list</span></div>}
                {isNewGroupOpen && <GroupEdit setIsNewGroupOpen={setIsNewGroupOpen} boardId={activeBoard._id} group={null} />}
                <Outlet />
            </main>
        </div>
    )
}

