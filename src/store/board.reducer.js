export const SET_BOARD = 'SET_BOARD';
export const REMOVE_CAR = 'REMOVE_CAR';
export const ADD_CAR = 'ADD_CAR';
export const ADD_GROUP = 'ADD_GROUP';
export const ADD_TO_CART = 'ADD_TO_CART';
export const CLEAR_CART = 'CLEAR_CART';
export const UNDO_REMOVE_CAR = 'UNDO_REMOVE_CAR';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const UPDATE_BOARD = 'UPDATE_BOARD';

const initialState = {
  boards: [],
  cart: [],
  lastRemovedCar: null
};

export function boardReducer(state = initialState, action) {
  var newState = state;
  var boards;
  switch (action.type) {
    case SET_BOARD:
      newState = { ...state, boards: action.boards };
      break;
    case REMOVE_CAR: {
      const lastRemovedCar = state.boards.find((boards) => boards._id === action.carId);
      boards = state.boards.filter((boards) => boards._id !== action.carId);
      newState = { ...state, boards, lastRemovedCar };
      break;
    }
    case UPDATE_BOARD:
      boards = state.boards.map((board) =>
        board._id === action.savedBoard._id ? action.savedBoard : board
      );
      newState = { ...state, boards };
      break;
    default:
  }
  return newState;
}
