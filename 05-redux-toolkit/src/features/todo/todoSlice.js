import {createSlice, nanoid} from '@reduxjs/toolkit'   

const initialState = {
    todos: [{
        id: nanoid(),
        text: 'Learn React',
        completed: false
    }]
}
export const todoSlice = createSlice({
    name: 'todo',
    initialState,
    reducers: {
        addTodo: (state, action) => {
            state.todos.push({
                id: nanoid(),
                text: action.payload,
                completed: false
            })
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload)
        },
        toggleTodo: (state, action) => {
            state.todos = state.todos.map((todo) => todo.id === action.payload ? {...todo, completed: !todo.completed} : todo)
        },
        editTodo: (state, action) => {
            state.todos = state.todos.map((todo) => todo.id === action.payload.id ? {...todo, text: action.payload.text} : todo)
        }
    }
})

export const {addTodo, removeTodo, toggleTodo, editTodo} = todoSlice.actions

export default todoSlice.reducer