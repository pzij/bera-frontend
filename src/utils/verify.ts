import { isSimpleDate } from "./date"

function verifyTodoRecord(todo: any) {
    return !!todo
        && todo.id
        && todo.date
        && isSimpleDate(todo.date)
        && todo.text
        && typeof todo.done !== "undefined"
        && todo.updatedAt
        && todo.createdAt
}

export {
    verifyTodoRecord
}