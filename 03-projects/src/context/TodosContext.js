import { createContext, useContext } from "react";

export const TodoContext = createContext({
    todos:[{
        id:1,
        todo:"hello todo",
        completed:false,        
    }],
    add:(todo)=>{},
    update:(id,todo)=>{},
    remove:(id)=>{},
    toggle:(id)=>{},
});

export const useTodo =() =>{
    return useContext(TodoContext)
}

export const TodoProvider = TodoContext.Provider;
