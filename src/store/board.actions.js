import { carService } from "../services/board.service.local.js";
import { store } from './store.js'
import { ADD_CAR, ADD_GROUP, ADD_TO_CART, CLEAR_CART, REMOVE_CAR, REMOVE_FROM_CART, SET_BOARD, UNDO_REMOVE_CAR, UPDATE_BOARD} from "./board.reducer.js";
import { boardService } from "../services/board.service.js";

// Action Creators:
export function getActionRemoveCar(carId) {
    return {
        type: REMOVE_CAR,
        carId
    }
}
export function getActionAddGroup(newGroup) {
    return {
        type: ADD_GROUP,
        newGroup
    }
}
// export function getActionAddBoard(board) {
//     return {
//         type: ADD_CAR,
//         board
//     }
// }

export async function loadBoard() {
    try {
        const boards = await boardService.query()
        console.log('Cars from DB:', boards)
        store.dispatch({
            type: SET_BOARD,
            boards
        })

    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }

}

export async function removeGroup(groupId, boardId) {
    try {
        const savedBoard = await boardService.removeGroup(groupId, boardId)
        store.dispatch({
            type: UPDATE_BOARD,
            savedBoard
        })
    } catch (err) {
        console.log('Cannot remove board', err)
        throw err
    }
}
export async function removeTask(taskId, groupId, boardId) {
    try {
        const savedBoard = await boardService.removeTask(taskId, groupId, boardId)
        store.dispatch({
            type: UPDATE_BOARD,
            savedBoard
        })
    } catch (err) {
        console.log('Cannot remove task', err)
        throw err
    }
}

// export async function addBoard(board) {
//     try {
//         const savedBoard = await boardService.save(board)
//         console.log('Added Board', savedCar)
//         store.dispatch(getActionAddBoard(savedBoard))
//         return savedBoard
//     } catch (err) {
//         console.log('Cannot add board', err)
//         throw err
//     }
// }
export async function addGroup(newGroup, boardId) {
    try {
        const savedBoard = await boardService.saveGroup(newGroup, boardId)
        // console.log('Added Group', savedGroup)
        // board.groups.push(savedGroup)
        store.dispatch({
            type: UPDATE_BOARD,
            savedBoard
        })
        return savedBoard
    } catch (err) {
        console.log('Cannot add GROUP', err)
        throw err
    }
}
export async function addTask(newTask, groupId, boardId) {
    try {
        const savedBoard = await boardService.saveTask(newTask, groupId, boardId)
        // console.log('Added Group', savedGroup)
        // board.groups.push(savedGroup)
        store.dispatch({
            type: UPDATE_BOARD,
            savedBoard
        })
        return savedBoard
    } catch (err) {
        console.log('Cannot add GROUP', err)
        throw err
    }
}

// export function updateCar(board) {
//     return carService.save(board)
//         .then(savedCar => {
//             console.log('Updated Board:', savedCar)
//             store.dispatch(getActionUpdateCar(savedCar))
//             return savedCar
//         })
//         .catch(err => {
//             console.log('Cannot save board', err)
//             throw err
//         })
// }

// export function addToCart(board) {
//     store.dispatch({
//         type: ADD_TO_CART,
//         board
//     })
// }

// export function removeFromCart(carId) {
//     store.dispatch({
//         type: REMOVE_FROM_CART,
//         carId
//     })
// }

// export async function checkout(total) {
//     try {
//         const score = await userService.changeScore(-total)
//         store.dispatch({ type: SET_SCORE, score })
//         store.dispatch({ type: CLEAR_CART })
//         return score
//     } catch (err) {
//         console.log('CarActions: err in checkout', err)
//         throw err
//     }
// }


// Demo for Optimistic Mutation 
// (IOW - Assuming the server call will work, so updating the UI first)
// export function onRemoveCarOptimistic(carId) {
//     store.dispatch({
//         type: REMOVE_CAR,
//         carId
//     })
//     showSuccessMsg('Board removed')

//     carService.remove(carId)
//         .then(() => {
//             console.log('Server Reported - Deleted Succesfully');
//         })
//         .catch(err => {
//             showErrorMsg('Cannot remove board')
//             console.log('Cannot load cars', err)
//             store.dispatch({
//                 type: UNDO_REMOVE_CAR,
//             })
//         })
// }
