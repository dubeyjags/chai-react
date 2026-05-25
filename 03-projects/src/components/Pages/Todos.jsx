import React, { useEffect, useState } from "react";
import { TodoProvider, useTodo } from "../../context/TodosContext.js";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const add = (todo) => {
    setTodos((prev) => [{id: Date.now(), ...todo }, ...prev]);
  };
  const update = (id, todo) => {
    setTodos((prev) => prev.map((todo) =>  (todo.id === id ? todo : todo)));
  };
  const remove = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };
  const toggle = (id) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))
    );
  };

  useEffect(()=>{
    const todos = JSON.parse(localStorage.getItem('todos')) && setTodos(JSON.parse(localStorage.getItem('todos')))
    if(todos && todos.length > 0){
            setTodos(todos)
    }
  },[])
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  return (
    <TodoProvider value={{ todos, add, update, remove, toggle }}>
      <div className="bg-[var(--bg)] w-500 py-8 self-baseline">
        <div className="w-full max-w-2xl mx-auto bg-[var(--bg-card)] shadow-md rounded-lg px-4 py-3 text-[var(--text-h)]">
          <h1 className="text-2xl font-bold text-center mb-8 mt-2">
            Manage Your Todos
          </h1>
          <div className="mb-4">
            <TodoForm />
          </div>
          <div className="flex flex-wrap gap-y-3">
            {todos.map((todo) => (
             <div className="w-full" key={todo.id}>
                 <TodoItem todo={todo} />
                </div>
            ))}
            </div>
        </div>
      </div>
    </TodoProvider>
  );
};

export default Todos;

export function TodoForm() {
    const [todo, setTodo] = useState("")
    const {add} = useTodo();

    const addTodo = (e) => {
        e.preventDefault();
        if(!todo) return;
        add({todo, completed: false});
        setTodo("");
    }



  return (
    <form onSubmit={addTodo} className="flex">
      <input
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        placeholder="Write Todo..."
        className="w-full border border-[var(--border)] rounded-l-lg px-3 outline-none duration-150 bg-[var(--bg)] text-[var(--text-h)] placeholder:text-[var(--text)] py-1.5"
      />
      <button
        type="submit"
        className="rounded-r-lg px-3 py-1 bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white shrink-0 duration-150"
      >
        Add
      </button>
    </form>
  );
}

export function TodoItem({ todo }) {
  const [isTodoEditable, setIsTodoEditable] = useState(false);
  const [todoMsg, setTodoMsg] = useState(todo.todo);
  const { update, remove, toggle } = useTodo();

  const deleteTodo = () => {
    remove(todo.id);
  };
  const editTodo = () => {
    setIsTodoEditable((prev) => !prev);
  };
  const saveTodo = () => {
    update(todo.id, { todo: todoMsg });
    setIsTodoEditable(false);
  };

  const toggleTodo = () => {
    toggle(todo.id);
  };

  return (
    <div
      className={`flex border border-[var(--border)] rounded-lg px-3 py-1.5 gap-x-3 shadow-sm duration-300 text-[var(--text-h)] ${
        todo.completed ? "bg-[#c6e9a7]" : "bg-[var(--bg-card)]"
      }`}
    >
      <input
        type="checkbox"
        className="cursor-pointer"
        checked={todo.completed}
        onChange={toggleTodo}
      />
      <input
        type="text"
        id={todo.id}
        className={`border outline-none w-full bg-transparent rounded-lg text-[var(--text-h)] ${
          isTodoEditable ? "border-[var(--border)] px-2" : "border-transparent"
        } ${todo.completed ? "line-through" : ""}`}
        value={todoMsg}
        onChange={(e) => setTodoMsg(e.target.value)}
        readOnly={!isTodoEditable}
      />
      {/* Edit, Save Button */}
      <button
        className="inline-flex w-8 h-8 rounded-lg text-sm border border-[var(--border)] justify-center items-center bg-[var(--bg)] hover:bg-[var(--bg-card)] shrink-0 disabled:opacity-50 duration-150"
        onClick={() => {
          if (todo.completed) return;

          if (isTodoEditable) {
            editTodo();
          } else setIsTodoEditable((prev) => !prev);
        }}
        disabled={todo.completed}
      >
        {isTodoEditable ? "📁" : "✏️"}
      </button>
      {/* Delete Todo Button */}
      <button
        className="inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center items-center bg-gray-50 hover:bg-gray-100 shrink-0"
        onClick={() => deleteTodo(todo.id)}
      >
        ❌
      </button>
    </div>
  );
}
