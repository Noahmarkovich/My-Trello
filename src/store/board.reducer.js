export const SET_BOARD = 'SET_BOARD'
export const REMOVE_CAR = 'REMOVE_CAR'
export const ADD_CAR = 'ADD_CAR'
export const UPDATE_CAR = 'UPDATE_CAR'
export const ADD_TO_CART = 'ADD_TO_CART'
export const CLEAR_CART = 'CLEAR_CART'
export const UNDO_REMOVE_CAR = 'UNDO_REMOVE_CAR'
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART'

const initialState = {
    board: [],
    cart: [],
    lastRemovedCar: null
}

export function boardReducer(state = initialState, action) {
    var newState = state
    var board
    var cart
    switch (action.type) {
        case SET_BOARD:
            newState = { ...state, board: action.board }
            break
        case REMOVE_CAR:
            const lastRemovedCar = state.board.find(board => board._id === action.carId)
            board = state.board.filter(board => board._id !== action.carId)
            newState = { ...state, board, lastRemovedCar }
            break
        case ADD_CAR:
            newState = { ...state, board: [...state.board, action.board] }
            break
        case UPDATE_CAR:
            board = state.board.map(board => (board._id === action.board._id) ? action.board : board)
            newState = { ...state, board }
            break
        case ADD_TO_CART:
            newState = { ...state, cart: [...state.cart, action.board] }
            break
        case REMOVE_FROM_CART:
            cart = state.cart.filter(board => board._id !== action.carId)
            newState = { ...state, cart }
            break
        case CLEAR_CART:
            newState = { ...state, cart: [] }
            break
        case UNDO_REMOVE_CAR:
            if (state.lastRemovedCar) {
                newState = { ...state, board: [...state.board, state.lastRemovedCar], lastRemovedCar: null }
            }
            break
        default:
    }
    return newState
}
