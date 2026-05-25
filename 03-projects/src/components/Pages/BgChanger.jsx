import { useState } from 'react'


function BgChanger() {
  const [color, setColor] = useState('#2C3E50')
  const colors = [
  { name: 'Deep Navy', color: '#2C3E50' },
  { name: 'Slate Blue', color: '#34495E' },
  { name: 'Soft Steel', color: '#5D6D7E' },
  { name: 'Muted Gray', color: '#7F8C8D' },
  { name: 'Elegant Teal', color: '#16A085' },
  { name: 'Calm Green', color: '#27AE60' },
  { name: 'Clean Blue', color: '#2980B9' },
  { name: 'Rich Purple', color: '#8E44AD' }
]

  return (
    <>
    <div className='flex justify-center items-center w-full h-[calc(100vh-94px)]' style={{backgroundColor:color}}>
     <div className='flex flex-col gap-4'>
      {colors.map((color, index) => (
        <button key={index} style={{backgroundColor:color.color, color:'white', textShadow:'1px 1px 2px black', cursor:'pointer'}} className='px-4 py-2 rounded box-shadow text-capitalize' onClick={() => setColor(color.color)}>{color.name}</button>
      ))}
      
     </div>
    </div>
    </>
  )
}

export default BgChanger
