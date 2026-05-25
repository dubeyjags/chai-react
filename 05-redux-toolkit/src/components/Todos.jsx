import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { removeTodo, toggleTodo, editTodo} from '../features/todo/todoSlice.js';

const Todos = () => {
    const todos = useSelector((state) => state.todo.todos)
    const dispatch = useDispatch();
    const [isTodoEditable, setIsTodoEditable] = useState(false);
    const [todoMsg, setTodoMsg] = useState("");
  return (
    <div className="flex flex-wrap gap-y-3">
        {todos && todos.map((todo) => (
            <div
                key={todo.id}
                className={`w-full flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300 text-black ${
                    todo.completed ? "bg-[#c6e9a7]" : "bg-[#ccbed7]"
                }`}
            >
                <input
                    type="checkbox"
                    className="cursor-pointer"
                    checked={todo.completed}
                    onChange={() => dispatch(toggleTodo(todo.id))}
                />
                {isTodoEditable && todo.id === todoMsg.id ? (
                    <input
                        type="text"
                        className="border border-black/10 px-2 outline-none w-full bg-transparent rounded-lg"
                        value={todoMsg.text}
                        onChange={(e) => setTodoMsg({ ...todoMsg, text: e.target.value })}
                    />
                ) : (
                    <span className={`outline-none text-left w-full bg-transparent rounded-lg ${todo.completed ? "line-through" : ""}`}>
                        {todo.text}
                    </span>
                )}
                
                {isTodoEditable && todo.id === todoMsg.id ? (
                    <button
                        className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-green-50 hover:bg-green-100 shrink-0"
                        onClick={() => { dispatch(editTodo(todoMsg)); setIsTodoEditable(false); }}
                    >
                        💾
                    </button>
                ): (
                    <button
                    className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50"
                    onClick={() => {
                        if (todo.completed) return;
                        setIsTodoEditable((prev) => !prev);
                        if (!isTodoEditable) setTodoMsg({ id: todo.id, text: todo.text });
                    }}
                    disabled={todo.completed}
                >
                    {isTodoEditable && todo.id === todoMsg.id ? "📁" : "✏️"}
                </button>
                )}
                <button
                    className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
                    onClick={() => dispatch(removeTodo(todo.id))}
                >
                    ❌
                </button>
            </div>
        ))}
    </div>
  )
}

export default Todos