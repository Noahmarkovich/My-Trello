import { httpService } from './http.service.js';
import { utilService } from './util.service.js';

const URL_BASE = 'board';

export const boardService = {
  query,
  getById,
  save,
  remove,
  getEmptyGroup,
  saveGroup,
  getEmptyTask,
  saveTask,
  removeGroup,
  removeTask,
  queryTask,
  saveLabel,
  newLabels,
  getEmptyChecklist,
  saveChecklist,
  getEmptyTodo,
  saveTodo,
  removeChecklist,
  removeTodo,
  getEmptyActivity,
  saveActivity,
  switchPlace,
  markStarred,
  updateBoard,
  getEmptyBoard
};

function getGroupIdx(board, groupId) {
  return board.groups.findIndex((group) => group.id === groupId);
}

async function query() {
  return httpService.get(URL_BASE);
}

async function getById(boardId) {
  return httpService.get(`board/${boardId}`);
}

async function queryTask(taskId, groupId, boardId) {
  const board = await getById(boardId);
  const groupIdx = getGroupIdx(board, groupId);
  const group = board.groups[groupIdx];
  const task = board.groups[groupIdx].tasks.find((task) => task.id === taskId);

  return { task, group };
}

async function remove(boardId) {
  return httpService.delete(`board/${boardId}`);
}

async function removeGroup(groupId, boardId) {
  let board = await getById(boardId);
  const groupIdx = getGroupIdx(board, groupId);
  board.groups.splice(groupIdx, 1);

  return save(board);
}

async function markStarred(isStarred, boardId) {
  let board = await getById(boardId);
  board.isStarred = isStarred;

  return save(board);
}
async function updateBoard(field, value, boardId) {
  let board = await getById(boardId);
  board[field] = value;

  return save(board);
}

async function removeTask(taskId, groupId, boardId) {
  let board = await getById(boardId);
  const groupIdx = getGroupIdx(board, groupId);
  const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === taskId);
  board.groups[groupIdx].tasks.splice(taskIdx, 1);

  return save(board);
}
async function removeChecklist(checklist, taskId, groupId, boardId) {
  let board = await getById(boardId);
  const groupIdx = getGroupIdx(board, groupId);
  const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === taskId);
  const checklistIdx = board.groups[groupIdx].tasks[taskIdx].checklists.findIndex(
    (checkList) => checkList.id === checklist.id
  );
  board.groups[groupIdx].tasks[taskIdx].checklists.splice(checklistIdx, 1);

  return save(board);
}
async function removeTodo(todoId, checklistId, taskId, groupId, boardId) {
  let board = await getById(boardId);
  const groupIdx = getGroupIdx(board, groupId);
  const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === taskId);
  const checklistIdx = board.groups[groupIdx].tasks[taskIdx].checklists.findIndex(
    (checkList) => checkList.id === checklistId
  );
  const todoIdx = board.groups[groupIdx].tasks[taskIdx].checklists[checklistIdx].todos.findIndex(
    (todo) => todo.id === todoId
  );
  board.groups[groupIdx].tasks[taskIdx].checklists[checklistIdx].todos.splice(todoIdx, 1);

  return save(board);
}
async function save(board) {
  let savedBoard;
  if (board._id) {
    savedBoard = await httpService.put(`board/${board._id}`, board);
  } else {
    savedBoard = await httpService.post('board', board);
  }

  return savedBoard;
}
async function saveGroup(newGroup, boardId) {
  let board = await getById(boardId);
  if (newGroup.id) {
    const groupIdx = board.groups.findIndex((group) => group.id === newGroup.id);
    board.groups.splice(groupIdx, 1, newGroup);
  } else {
    newGroup.archivedAt = Date.now();
    newGroup.id = utilService.makeId();
    board.groups.push(newGroup);
  }

  return save(board);
}
async function saveTask(newTask, groupId, boardId) {
  let board = await getById(boardId);
  const groupIdx = getGroupIdx(board, groupId);
  if (newTask.id) {
    const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === newTask.id);
    board.groups[groupIdx].tasks.splice(taskIdx, 1, newTask);
  } else {
    newTask.archivedAt = Date.now();
    newTask.id = utilService.makeId();
    board.groups[groupIdx].tasks.push(newTask);
  }

  return save(board);
}
async function switchPlace(taskIdx, groupId, currParams, boardId) {
  let board = await getById(boardId);
  const groupIdx = getGroupIdx(board, groupId);
  const [removed] = board.groups[groupIdx].tasks.splice(taskIdx, 1);
  board.groups[getGroupIdx(board, currParams.droppableId)].tasks.splice(
    currParams.index,
    0,
    removed
  );

  return save(board);
}

async function saveLabel(savedLabel, boardId) {
  let board = await getById(boardId);

  if (savedLabel.id) {
    const labelIdx = board.labels.findIndex((label) => label.id === savedLabel.id);
    board.labels.splice(labelIdx, 1, savedLabel);
  } else {
    savedLabel.id = utilService.makeId();
    board.labels.push(savedLabel);
  }

  return save(board);
}
async function saveActivity(savedActivity, boardId) {
  let board = await getById(boardId);

  savedActivity.id = utilService.makeId();
  savedActivity.createdAt = Date.now();
  board.activities.unshift(savedActivity);

  return save(board);
}

async function saveChecklist(checkList, currTask, currGroup, boardId) {
  let board = await getById(boardId);
  const groupIdx = board.groups.findIndex((group) => group.id === currGroup.id);
  const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === currTask.id);
  if (currTask.checklists && checkList.id) {
    // const labelIdx = board.labels.findIndex((label) => label.id === savedLabel.id);
  } else if (currTask.checklists) {
    checkList.id = utilService.makeId();
    currTask.checklists.push(checkList);
  } else {
    checkList.id = utilService.makeId();
    currTask['checklists'] = [checkList];
  }
  board.groups[groupIdx].tasks.splice(taskIdx, 1, currTask);

  return save(board);
}
async function saveTodo(currTodo, checkList, currTask, groupId, boardId) {
  let board = await getById(boardId);
  const groupIdx = getGroupIdx(board, groupId);
  const taskIdx = board.groups[groupIdx].tasks.findIndex((task) => task.id === currTask.id);
  const checklistIdx = board.groups[groupIdx].tasks[taskIdx].checklists.findIndex(
    (checklist) => checklist.id === checkList.id
  );
  if (currTodo.id) {
    const todoIdx = checkList.todos.findIndex((todo) => todo.id === currTodo.id);

    checkList.todos.splice(todoIdx, 1, currTodo);
  } else {
    currTodo.id = utilService.makeId();
    checkList.todos.push(currTodo);
  }
  board.groups[groupIdx].tasks[taskIdx].checklists.splice(checklistIdx, 1, checkList);

  return save(board);
}

function getEmptyGroup() {
  return {
    id: '',
    title: '',
    archivedAt: '',
    tasks: [],
    style: {}
  };
}

function getEmptyChecklist() {
  return {
    id: '',
    title: 'Checklist',
    todos: []
  };
}

function getEmptyTask() {
  return {
    id: '',
    title: '',
    archivedAt: ''
  };
}
function getEmptyTodo() {
  return {
    id: '',
    title: '',
    isDone: false
  };
}
function getEmptyActivity() {
  return {
    id: '',
    txt: '',
    createdAt: '',
    byMember: {
      _id: '',
      fullname: '',
      avatar: ''
    },
    task: {
      id: '',
      title: ''
    }
  };
}
function getEmptyBoard() {
  return {
    title: '',
    isStarred: false,
    archivedAt: '',
    createdBy: {},
    style: {
      header: 'rgb(11, 80, 175)',
      background: "url('https://a.trellocdn.com/prgb/assets/d106776cb297f000b1f4.svg')"
    },
    labels: [
      {
        id: 'l101',
        title: '',
        name: 'green',
        colorDark: '#7BC86C',
        colorLight: '#D6ECD2'
      },
      {
        id: 'l102',
        title: '',
        name: 'yellow',
        colorDark: '#F5DD29',
        colorLight: '#FAF3C0'
      },
      {
        id: 'l103',
        title: '',
        name: 'orange',
        colorDark: '#FFAF3F',
        colorLight: '#FCE6C6'
      },
      {
        id: 'l104',
        title: '',
        name: 'red',
        colorDark: '#EF7564',
        colorLight: '#F5D3CE'
      },
      {
        id: 'l105',
        title: '',
        name: 'purple',
        colorDark: '#CD8DE5',
        colorLight: '#EDDBF4'
      }
    ],
    members: [],
    groups: [],
    activities: []
  };
}

function newLabels() {
  return [
    {
      id: '',
      title: '',
      name: 'light green',
      colorDark: '#B7DDB0',
      colorLight: '#EEF6EC'
    },
    {
      id: '',
      title: '',
      name: 'light yellow',
      colorDark: '#F5EA92',
      colorLight: '#FDF4E7'
    },
    {
      id: '',
      title: '',
      name: 'light orange',
      colorDark: '#FAD29C',
      colorLight: '#FDF4E7'
    },
    {
      id: '',
      title: '',
      name: 'light red',
      colorDark: '#EFB3AB',
      colorLight: '#FBEDEB'
    },
    {
      id: '',
      title: '',
      name: 'light purple',
      colorDark: '#DFC0EB',
      colorLight: '#F7F0FA'
    },
    {
      id: '',
      title: '',
      name: 'green',
      colorDark: '#7BC86C',
      colorLight: '#D6ECD2'
    },
    {
      id: '',
      title: '',
      name: 'yellow',
      colorDark: '#F5DD29',
      colorLight: '#FAF3C0'
    },
    {
      id: '',
      title: '',
      name: 'orange',
      colorDark: '#FFAF3F',
      colorLight: '#FCE6C6'
    },
    {
      id: '',
      title: '',
      name: 'red',
      colorDark: '#EF7564',
      colorLight: '#F5D3CE'
    },
    {
      id: '',
      title: '',
      name: 'purple',
      colorDark: '#CD8DE5',
      colorLight: '#EDDBF4'
    }
  ];
}
