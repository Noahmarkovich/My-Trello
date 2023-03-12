import { carService } from "../services/board.service.local.js";
import { userService } from "../services/user.service.js";
import { store } from './store.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { ADD_CAR, ADD_TO_CART, CLEAR_CART, REMOVE_CAR, REMOVE_FROM_CART, SET_BOARD, UNDO_REMOVE_CAR, UPDATE_CAR } from "./board.reducer.js";
import { SET_SCORE } from "./user.reducer.js";
import { boardService } from "../services/board.service.js";

// Action Creators:
export function getActionRemoveCar(carId) {
    return {
        type: REMOVE_CAR,
        carId
    }
}
export function getActionAddCar(board) {
    return {
        type: ADD_CAR,
        board
    }
}
export function getActionUpdateCar(board) {
    return {
        type: UPDATE_CAR,
        board
    }
}

export async function loadBoard() {
    try {
        const board = await boardService.query()
        console.log('Cars from DB:', board)
        store.dispatch({
            type: SET_BOARD,
            board
        })

    } catch (err) {
        console.log('Cannot load board', err)
        throw err
    }

}

export async function removeCar(carId) {
    try {
        await carService.remove(carId)
        store.dispatch(getActionRemoveCar(carId))
    } catch (err) {
        console.log('Cannot remove board', err)
        throw err
    }
}

export async function addCar(board) {
    try {
        const savedCar = await carService.save(board)
        console.log('Added Board', savedCar)
        store.dispatch(getActionAddCar(savedCar))
        return savedCar
    } catch (err) {
        console.log('Cannot add board', err)
        throw err
    }
}

export function updateCar(board) {
    return carService.save(board)
        .then(savedCar => {
            console.log('Updated Board:', savedCar)
            store.dispatch(getActionUpdateCar(savedCar))
            return savedCar
        })
        .catch(err => {
            console.log('Cannot save board', err)
            throw err
        })
}

export function addToCart(board) {
    store.dispatch({
        type: ADD_TO_CART,
        board
    })
}

export function removeFromCart(carId) {
    store.dispatch({
        type: REMOVE_FROM_CART,
        carId
    })
}

export async function checkout(total) {
    try {
        const score = await userService.changeScore(-total)
        store.dispatch({ type: SET_SCORE, score })
        store.dispatch({ type: CLEAR_CART })
        return score
    } catch (err) {
        console.log('CarActions: err in checkout', err)
        throw err
    }
}


// Demo for Optimistic Mutation 
// (IOW - Assuming the server call will work, so updating the UI first)
export function onRemoveCarOptimistic(carId) {
    store.dispatch({
        type: REMOVE_CAR,
        carId
    })
    showSuccessMsg('Board removed')

    carService.remove(carId)
        .then(() => {
            console.log('Server Reported - Deleted Succesfully');
        })
        .catch(err => {
            showErrorMsg('Cannot remove board')
            console.log('Cannot load cars', err)
            store.dispatch({
                type: UNDO_REMOVE_CAR,
            })
        })
}
