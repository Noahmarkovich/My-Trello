
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'
import { userService } from './user.service.js'

const STORAGE_KEY = 'board'

export const carService = {
    query,
    getById,
    save,
    remove,
    getEmptyCar,
    addCarMsg
}
window.cs = carService


async function query(filterBy = { txt: '', price: 0 }) {
    var cars = await storageService.query(STORAGE_KEY)
    if (filterBy.txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        cars = cars.filter(board => regex.test(board.vendor) || regex.test(board.description))
    }
    if (filterBy.price) {
        cars = cars.filter(board => board.price <= filterBy.price)
    }
    return cars
}

function getById(carId) {
    return storageService.get(STORAGE_KEY, carId)
}

async function remove(carId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, carId)
}

async function save(board) {
    var savedCar
    if (board._id) {
        savedCar = await storageService.put(STORAGE_KEY, board)
    } else {
        // Later, owner is set by the backend
        board.owner = userService.getLoggedinUser()
        savedCar = await storageService.post(STORAGE_KEY, board)
    }
    return savedCar
}

async function addCarMsg(carId, txt) {
    // Later, this is all done by the backend
    const board = await getById(carId)
    if (!board.msgs) board.msgs = []

    const msg = {
        id: utilService.makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    board.msgs.push(msg)
    await storageService.put(STORAGE_KEY, board)

    return msg
}

function getEmptyCar() {
    return {
        vendor: 'Susita-' + (Date.now() % 1000),
        price: utilService.getRandomIntInclusive(1000, 9000),
    }
}


// TEST DATA
// storageService.post(STORAGE_KEY, {vendor: 'Subali Rahok 2', price: 980}).then(x => console.log(x))




