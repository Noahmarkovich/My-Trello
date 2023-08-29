export const SET_BOARD = 'SET_BOARD';
export const ADD_BOARD = 'ADD_BOARD';
export const ADD_GROUP = 'ADD_GROUP';
export const UPDATE_BOARD = 'UPDATE_BOARD';
export const SET_ACTIVE_BOARD = 'SET_ACTIVE_BOARD';

const initialState = {
  boards: [],
  activeBoard: null
};

export function boardReducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case SET_ACTIVE_BOARD:
      newState = { ...state, activeBoard: action.activeBoard };
      break;
    case SET_BOARD:
      newState = { ...state, boards: action.boards };
      break;
    case ADD_BOARD: {
      newState = { ...state, boards: [...state.boards, action.board] };
      break;
    }
    case UPDATE_BOARD: {
      const boards = state.boards.map((board) =>
        board._id === action.savedBoard._id ? action.savedBoard : board
      );
      newState = { ...state, boards };
      break;
    }

    default:
  }

  return newState;
}
