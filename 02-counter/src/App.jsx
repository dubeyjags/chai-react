import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  const increment = () => {
    setCount(count + 1)
    console.log(count)
  }
  const decrement = () => {
    setCount(count - 1)
    console.log(count)
  }


  return (
    <>
    <h1>Counter</h1>
    <h2>{count}</h2>
    <button onClick={increment}>Increment</button> 
    <button onClick={decrement}>Decrement</button>
    </>
  )
}

export default App
