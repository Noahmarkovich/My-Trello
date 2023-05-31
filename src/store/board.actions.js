import { boardService } from '../services/board.service.js';
import { ADD_GROUP, REMOVE_CAR, SET_BOARD, UPDATE_BOARD } from './board.reducer.js';
import { store } from './store.js';

// Action Creators:
export function getActionRemoveCar(carId) {
  return {
    type: REMOVE_CAR,
    carId
  };
}
export function getActionAddGroup(newGroup) {
  return {
    type: ADD_GROUP,
    newGroup
  };
}

export async function loadBoard() {
  try {
    const boards = await boardService.query();
    // console.log('Cars from DB:', boards);
    store.dispatch({
      type: SET_BOARD,
      boards
    });
  } catch (err) {
    console.log('Cannot load board', err);
    throw err;
  }
}
export async function markStarred(isStarred, boardId) {
  try {
    const savedBoard = await boardService.markStarred(isStarred, boardId);

    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });
  } catch (err) {
    console.log('Cannot load board', err);
    throw err;
  }
}
export async function updateBoard(field, value, boardId) {
  try {
    const savedBoard = await boardService.updateBoard(field, value, boardId);

    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });
  } catch (err) {
    console.log('Cannot load board', err);
    throw err;
  }
}

export async function removeGroup(groupId, boardId) {
  try {
    const savedBoard = await boardService.removeGroup(groupId, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });
  } catch (err) {
    console.log('Cannot remove board', err);
    throw err;
  }
}
export async function removeTask(taskId, groupId, boardId) {
  try {
    const savedBoard = await boardService.removeTask(taskId, groupId, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });
  } catch (err) {
    console.log('Cannot remove task', err);
    throw err;
  }
}
export async function removeChecklist(checklist, taskId, groupId, boardId) {
  try {
    const savedBoard = await boardService.removeChecklist(checklist, taskId, groupId, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });
  } catch (err) {
    console.log('Cannot remove task', err);
    throw err;
  }
}
export async function removeTodo(todoId, checklistId, taskId, groupId, boardId) {
  try {
    const savedBoard = await boardService.removeTodo(todoId, checklistId, taskId, groupId, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });
  } catch (err) {
    console.log('Cannot remove task', err);
    throw err;
  }
}

export async function addGroup(newGroup, boardId) {
  try {
    const savedBoard = await boardService.saveGroup(newGroup, boardId);
    // console.log('Added Group', savedGroup)
    // board.groups.push(savedGroup)
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });

    return savedBoard;
  } catch (err) {
    console.log('Cannot add GROUP', err);
    throw err;
  }
}
export async function addTask(newTask, groupId, boardId) {
  try {
    const savedBoard = await boardService.saveTask(newTask, groupId, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });

    return savedBoard;
  } catch (err) {
    console.log('Cannot add GROUP', err);
    throw err;
  }
}
export async function switchPlace(taskIdx, groupIdx, currParams, boardId) {
  try {
    const savedBoard = await boardService.switchPlace(taskIdx, groupIdx, currParams, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });

    return savedBoard;
  } catch (err) {
    console.log('Cannot add GROUP', err);
    throw err;
  }
}

export async function saveLabel(label, boardId) {
  try {
    const savedBoard = await boardService.saveLabel(label, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });

    return savedBoard;
  } catch (err) {
    console.log('Cannot save board', err);
    throw err;
  }
}
export async function saveActivity(activity, boardId) {
  try {
    const savedBoard = await boardService.saveActivity(activity, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });

    return savedBoard;
  } catch (err) {
    console.log('Cannot save board', err);
    throw err;
  }
}
export async function saveTodo(todo, checkList, task, groupId, boardId) {
  try {
    const savedBoard = await boardService.saveTodo(todo, checkList, task, groupId, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });

    return savedBoard;
  } catch (err) {
    console.log('Cannot save board', err);
    throw err;
  }
}

export async function saveChecklist(checkList, task, currGroup, boardId) {
  try {
    const savedBoard = await boardService.saveChecklist(checkList, task, currGroup, boardId);
    store.dispatch({
      type: UPDATE_BOARD,
      savedBoard
    });

    return savedBoard;
  } catch (err) {
    console.log('Cannot save board', err);
    throw err;
  }
}
