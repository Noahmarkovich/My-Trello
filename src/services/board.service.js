
import { storageService } from './async-storage.service.js'
import { httpService } from './http.service.js'
import { utilService } from './util.service.js'
// import { userService } from './user.service.js'


const STORAGE_KEY = 'board'
_createBoards()

export const boardService = {
    query,
    getById,
    save,
    remove,
    getEmptyGroup,
    addCarMsg,
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
    removeChecklist
}
window.cs = boardService


async function query(filterBy = { txt: '' }) {
    // return httpService.get(STORAGE_KEY, filterBy)
    var board = await storageService.query(STORAGE_KEY)
    // console.log(board['groups'][0]['tasks']);
    // if (filterBy.txt) {
    //     const regex = new RegExp(filterBy.txt, 'i')
    //     cars = cars.filter(board => regex.test(board.vendor) || regex.test(board.description))
    // }
    // if (filterBy.price) {
    //     cars = cars.filter(board => board.price <= filterBy.price)
    // }
    return board
}

async function getById(boardId) {
    return storageService.get(STORAGE_KEY, boardId)
    // return httpService.get(`board/${carId}`)
}

async function queryTask(taskId, groupId, boardId) {
    const board = await getById(boardId)
    const groupIdx = board.groups.findIndex(group => group.id === groupId)
    const group = board.groups[groupIdx]
    const task = board.groups[groupIdx].tasks.find(task => task.id === taskId)
    // console.log(task);
    return { task, group }
}



async function remove(carId) {
    // await storageService.remove(STORAGE_KEY, carId)
    return httpService.delete(`board/${carId}`)
}
async function removeGroup(groupId, boardId) {
    let board = await getById(boardId)
    const groupIdx = board.groups.findIndex(group => group.id === groupId)
    board.groups.splice(groupIdx, 1)
    return save(board)
    // await storageService.remove(STORAGE_KEY, carId)
    // return httpService.delete(`board/${carId}`)
}
async function removeTask(taskId, groupId, boardId) {
    let board = await getById(boardId)
    const groupIdx = board.groups.findIndex(group => group.id === groupId)
    const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId)
    board.groups[groupIdx].tasks.splice(taskIdx, 1)
    return save(board)
    // await storageService.remove(STORAGE_KEY, carId)
    // return httpService.delete(`board/${carId}`)
}
async function removeChecklist(checklist, taskId, groupId, boardId) {
    let board = await getById(boardId)
    const groupIdx = board.groups.findIndex(group => group.id === groupId)
    const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === taskId)
    const checklistIdx = board.groups[groupIdx].tasks[taskIdx].checklists.findIndex(checkList => checkList.id === checklist.id)
    board.groups[groupIdx].tasks[taskIdx].checklists.splice(checklistIdx, 1)
    return save(board)
    // await storageService.remove(STORAGE_KEY, carId)
    // return httpService.delete(`board/${carId}`)
}
async function save(board) {
    var savedBoard
    if (board._id) {
        savedBoard = await storageService.put(STORAGE_KEY, board)
        // savedCar = await httpService.put(`board/${board._id}`, board)

    } else {
        // Later, owner is set by the backend
        // board.owner = userService.getLoggedinUser()
        savedBoard = await storageService.post(STORAGE_KEY, board)
        // savedCar = await httpService.post('board', board)
    }
    return savedBoard
}
async function saveGroup(newGroup, boardId) {
    let board = await getById(boardId)
    if (newGroup.id) {
        const groupIdx = board.groups.findIndex(group => group.id === newGroup.id)
        board.groups.splice(groupIdx, 1, newGroup)
        // savedGroup = await storageService.put(STORAGE_KEY, newGroup)
        // savedCar = await httpService.put(`board/${board._id}`, board)

    } else {
        // Later, owner is set by the backend
        newGroup.archivedAt = Date.now()
        newGroup.id = utilService.makeId()
        board.groups.push(newGroup)

        // savedGroup = await storageService.postGroup(STORAGE_KEY, newGroup, 'groups')
        // savedCar = await httpService.post('board', board)
    }
    return save(board)
}
async function saveTask(newTask, groupId, boardId) {
    let board = await getById(boardId)
    const groupIdx = board.groups.findIndex(group => group.id === groupId)
    if (newTask.id) {
        const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === newTask.id)
        board.groups[groupIdx].tasks.splice(taskIdx, 1, newTask)
        // savedCar = await httpService.put(`board/${board._id}`, board)

    } else {
        newTask.archivedAt = Date.now()
        newTask.id = utilService.makeId()
        board.groups[groupIdx].tasks.push(newTask)

        // savedCar = await httpService.post('board', board)
    }
    return save(board)
}

async function saveLabel(savedLabel, boardId) {
    let board = await getById(boardId)

    if (savedLabel.id) {
        const labelIdx = board.labels.findIndex(label => label.id === savedLabel.id)
        board.labels.splice(labelIdx, 1, savedLabel)
    } else {
        savedLabel.id = utilService.makeId()
        board.labels.push(savedLabel)
        // savedCar = await httpService.post('board', board)
    }
    return save(board)
}

async function saveChecklist(checkList, currTask, currGroup, boardId) {
    let board = await getById(boardId)
    const groupIdx = board.groups.findIndex(group => group.id === currGroup.id)
    const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === currTask.id)
    if (currTask.checklists && checkList.id) {
        // const labelIdx = board.labels.findIndex(label => label.id === savedLabel.id)
        // board.labels.splice(labelIdx, 1, savedLabel
    } else if (currTask.checklists) {
        checkList.id = utilService.makeId()
        currTask.checklists.push(checkList)
    } else {
        checkList.id = utilService.makeId()
        currTask['checklists'] = [checkList]
    }
    board.groups[groupIdx].tasks.splice(taskIdx, 1, currTask)
    return save(board)
}
async function saveTodo(currTodo, checkList, currTask, groupId, boardId) {
    let board = await getById(boardId)
    const groupIdx = board.groups.findIndex(group => group.id === groupId)
    const taskIdx = board.groups[groupIdx].tasks.findIndex(task => task.id === currTask.id)
    const checklistIdx = board.groups[groupIdx].tasks[taskIdx].checklists.findIndex(checklist => checklist.id === checkList.id)
    if (currTodo.id) {
        const todoIdx = checkList.todos.findIndex(todo => todo.id === currTodo.id)
        // board.groups[groupIdx].tasks.splice(taskIdx, 1, newTask)
        checkList.todos.splice(todoIdx, 1, currTodo)

    } else {
        currTodo.id = utilService.makeId()
        checkList.todos.push(currTodo)
    }
    board.groups[groupIdx].tasks[taskIdx].checklists.splice(checklistIdx, 1, checkList)
    // board.groups[groupIdx].tasks.splice(taskIdx, 1, currTask)
    return save(board)
}


async function addCarMsg(carId, txt) {
    const savedMsg = await httpService.post(`board/${carId}/msg`, { txt })
    return savedMsg
}


function getEmptyGroup() {
    return {
        "id": "",
        "title": "",
        "archivedAt": "",
        "tasks": [],
        "style": {}
    }
}

function getEmptyChecklist() {
    return {
        "id": "",
        "title": "Checklist",
        "todos": []

    }
}

function getEmptyTask() {
    return {
        "id": "",
        "title": "",
        "archivedAt": "",
    }
}
function getEmptyTodo() {
    return {
        "id": "",
        "title": "",
        "isDone": false,
    }
}


function newLabels() {
    return [
        {
            "id": "",
            "title": "",
            "name": "light green",
            "colorDark": "#B7DDB0",
            "colorLight": "#EEF6EC"
        },
        {
            "id": "",
            "title": "",
            "name": "light yellow",
            "colorDark": "#F5EA92",
            "colorLight": "#FDF4E7"
        },
        {
            "id": "",
            "title": "",
            "name": "light orange",
            "colorDark": "#FAD29C",
            "colorLight": "#FDF4E7"
        },
        {
            "id": "",
            "title": "",
            "name": "light red",
            "colorDark": "#EFB3AB",
            "colorLight": "#FBEDEB"
        },
        {
            "id": "",
            "title": "",
            "name": "light purple",
            "colorDark": "#DFC0EB",
            "colorLight": "#F7F0FA"
        },
        {
            "id": "",
            "title": "",
            "name": "green",
            "colorDark": "#7BC86C",
            "colorLight": "#D6ECD2"
        },
        {
            "id": "",
            "title": "",
            "name": "yellow",
            "colorDark": "#F5DD29",
            "colorLight": "#FAF3C0"
        },
        {
            "id": "",
            "title": "",
            "name": "orange",
            "colorDark": "#FFAF3F",
            "colorLight": "#FCE6C6"
        },
        {
            "id": "",
            "title": "",
            "name": "red",
            "colorDark": "#EF7564",
            "colorLight": "#F5D3CE"
        },
        {
            "id": "",
            "title": "",
            "name": "purple",
            "colorDark": "#CD8DE5",
            "colorLight": "#EDDBF4"
        },

    ]
}

function _createBoards() {
    let boards = utilService.loadFromStorage(STORAGE_KEY);
    if (!boards || boards.length === 0) {
        boards =
            [{
                "_id": "b101",
                "title": "Robot dev proj",
                "isStarred": false,
                "archivedAt": 1589983468418,
                "createdBy": {
                    "_id": "u101",
                    "fullname": "Abi Abambi",
                    "imgUrl": "http://some-img"
                },
                "style": {},
                "labels": [
                    {
                        "id": "l101",
                        "title": "Done",
                        "name": "green",
                        "colorDark": "#7BC86C",
                        "colorLight": "#D6ECD2"
                    },
                    {
                        "id": "l102",
                        "title": "Progress",
                        "name": "yellow",
                        "colorDark": "#F5DD29",
                        "colorLight": "#FAF3C0"
                    },
                    {
                        "id": "l103",
                        "title": "",
                        "name": "orange",
                        "colorDark": "#FFAF3F",
                        "colorLight": "#FCE6C6"
                    },
                    {
                        "id": "l104",
                        "title": "",
                        "name": "red",
                        "colorDark": "#EF7564",
                        "colorLight": "#F5D3CE"
                    },
                    {
                        "id": "l105",
                        "title": "",
                        "name": "purple",
                        "colorDark": "#CD8DE5",
                        "colorLight": "#EDDBF4"
                    },

                ],
                "members": [
                    {
                        "_id": "u101",
                        "fullname": "Tal Tarablus",
                        "imgUrl": "https://www.google.com"
                    }
                ],
                "groups": [
                    {
                        "id": "g101",
                        "title": "Group 1",
                        "archivedAt": 1589983468418,
                        "tasks": [
                            {
                                "id": "c101",
                                "title": "Replace logo"
                            },
                            {
                                "id": "c102",
                                "title": "Add Samples"
                            }
                        ],
                        "style": {}
                    },
                    {
                        "id": "g102",
                        "title": "Group 2",
                        "tasks": [
                            {
                                "id": "c103",
                                "title": "Do that",
                                "archivedAt": 1589983468418,
                            },
                            {
                                "id": "c104",
                                "title": "Help me",
                                "description": "description",
                                "comments": [
                                    {
                                        "id": "ZdPnm",
                                        "txt": "also @yaronb please CR this",
                                        "createdAt": 1590999817436,
                                        "byMember": {
                                            "_id": "u101",
                                            "fullname": "Tal Tarablus",
                                            "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
                                        }
                                    }
                                ],
                                "checklists": [
                                    {
                                        "id": "YEhmF",
                                        "title": "Checklist",
                                        "todos": [
                                            {
                                                "id": "212jX",
                                                "title": "To Do 1",
                                                "isDone": false
                                            }
                                        ]
                                    }
                                ],
                                "memberIds": ["u101"],
                                "labelIds": ["l101", "l102"],
                                "dueDate": 16156215211,
                                "byMember": {
                                    "_id": "u101",
                                    "username": "Tal",
                                    "fullname": "Tal Tarablus",
                                    "imgUrl": "http://res.cloudinary.com/shaishar9/image/upload/v1590850482/j1glw3c9jsoz2py0miol.jpg"
                                },
                                "style": {
                                    "bgColor": "#26de81"
                                }
                            }
                        ],
                        "style": {}
                    }
                ],
                "activities": [
                    {
                        "id": "a101",
                        "txt": "Changed Color",
                        "createdAt": 154514,
                        "byMember": {
                            "_id": "u101",
                            "fullname": "Abi Abambi",
                            "imgUrl": "http://some-img"
                        },
                        "task": {
                            "id": "c101",
                            "title": "Replace Logo"
                        }
                    }
                ],

                "cmpsOrder": ["status-picker", "member-picker", "date-picker"]
            }]
        utilService.saveToStorage(STORAGE_KEY, boards);
    }
}




