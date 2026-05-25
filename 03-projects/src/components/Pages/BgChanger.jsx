import { useState } from 'react'


function BgChanger() {
  const [color, setColor] = useState('green')
  const colors = ['red', 'black', 'blue', 'green', 'orange', 'yellow', 'pink', 'purple']

  return (
    <>
    <div className='flex justify-center items-center h-screen' style={{backgroundColor:color}}>
     <div className='d-flex'>
      {colors.map((color, index) => (
        <button key={index} style={{backgroundColor:color, color:'white', textShadow:'1px 1px 2px black', cursor:'pointer'}} className='px-4 py-2 rounded box-shadow text-capitalize' onClick={() => setColor(color)}>{color}</button>
      ))}
      
     </div>
    </div>
    </>
  )
}

export default BgChanger
